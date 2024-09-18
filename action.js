"use strict";
const main = async ({ 
// context,
core, github, exec,
// glob,
// io,
// require,
 }) => {
    const startTime = performance.now();
    const username = core.getInput('username', { required: true, trimWhitespace: true });
    const isLocal = core.getBooleanInput('local') ?? false;
    const usePublicEmail = core.getBooleanInput('use-public-email') ?? false;
    const gitNameTmpl = core.getInput('git-name-tmpl');
    const failoverName = core.getInput('failover-name');
    const failoverEmail = core.getInput('failover-email');
    if (!username) {
        core.setFailed("🚫 Missing 'username' input");
        return;
    }
    if (failoverName && !failoverEmail) {
        core.setFailed("🚫 Failover name provided without failover email");
        return;
    }
    core.info(`🔍 Fetching GitHub user details for '${username}'`);
    let user;
    try {
        const { data } = await github.rest.users.getByUsername({ username });
        user = data;
    }
    catch (error) {
        // const { RequestError } = await import("@octokit/request-error")
        const e = error;
        core.error(`❌ Error fetching user data: ${e.status}: ${e.message}`);
        console.error({ e });
        if (!failoverEmail) {
            core.setFailed('❌ API failed and no failover email provided');
            return;
        }
        user = { login: username };
    }
    // Delete useless API URLs
    for (const _key in user) {
        const key = _key;
        if (key.endsWith('url') && user[key].startsWith('https://api.github.com/')) {
            delete user[key];
        }
    }
    const gitUserName = (() => {
        if (!user.id) {
            return failoverName || username;
        }
        if (gitNameTmpl) {
            return gitNameTmpl.replace(/\{\{(\w+)\}\}/g, (_match, field) => `${user[field]}`);
        }
        return (user.name && user.name.trim()) ? user.name : (user.login ?? '');
    })();
    const gitUserEmail = (() => {
        if (!user.id) {
            return failoverEmail;
        }
        if (usePublicEmail && user.email) {
            return user.email;
        }
        return `${user.id}+${user.login}@users.noreply.github.com`;
    })();
    core.setOutput('user-json', JSON.stringify(user));
    core.setOutput('git-user-name', gitUserName);
    core.setOutput('git-user-email', gitUserEmail);
    core.info('⚙️ Setting up Git user configuration...');
    const gitConfigScope = isLocal ? '--local' : '--global';
    const gitConfigArgs = ['config', gitConfigScope, '--'];
    // do not use Promise.all(), since `git config` fails if it finds a locked config file like this:
    //
    //     error: could not lock config file .git/config: File exists
    //
    await exec.exec('git', [...gitConfigArgs, 'user.name', gitUserName]);
    await exec.exec('git', [...gitConfigArgs, 'user.email', gitUserEmail]);
    const runtime = (performance.now() - startTime).toFixed(2);
    core.info(`✅ Successfully configured Git user.name and user.email in ${runtime} ms`);
};
module.exports = main;
//# sourceMappingURL=action.js.map