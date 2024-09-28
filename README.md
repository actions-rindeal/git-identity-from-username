# 🔧🤖🆔 Configure Git Identity from GitHub Username

Stop hardcoding unclear `git config user.email 12345+foo[bot]@users.noreply.github.com ...` commands!<br>
Let this well-tested, robust and performance-optimized GitHub Action handle it for you.

[![Test](https://github.com/actions-rindeal/git-config-user-bot/actions/workflows/test.yml/badge.svg)](https://github.com/actions-rindeal/git-config-user-bot/actions/workflows/test.yml)

## 📚 Details

Using a GitHub username and REST API, it fetches GitHub user details,
then generates and sets proper Git name and email, so that all commits made in your workflow are attributed to this user.

The user may also be an app/bot, eg. `username: github-actions[bot]` will attribute all commits to the `github-actions` app.

## 💡 Features

- **Fast**: Performance optimized to complete in just ~200ms.
- **User-Friendly**: Just a single `- uses: ...` step line is all you need in most use cases.
- **Robust**: Handles all kinds of possible errors and edge cases.
- **Tested**: The action code undergoes thorough unit testing with every git push.
- **Useful**: Creates detailed logs and offers versatile action outputs for broader usability.

## 🚀 Usage

```yaml
jobs:
  'example':
    runs-on: 'ubuntu-latest'
    steps:
      - name: "⬇️ Checkout"
        uses: 'actions/checkout@main'

      - name: "🔧🤖🆔 Set Git Identity"
        uses: 'actions-rindeal/git-identity-from-username@v2'
        with:
          # 'username': 'octocat' # `github-actions[bot]` by default
```

## 📥 Inputs

Name               | Description                                             | Default 
:----------------- | :------------------------------------------------------ | :------
`username`         | The GitHub username to fetch details for | `github-actions[bot]`
`local`            | Use local Git config instead of global   | `false`
`use-public-email` | Use the public email of the GitHub user instead of the user's GitHub noreply address | `false`
`git-name-tmpl`    | Template for the Git user.name, using placeholders for user fields (e.g., `{{name}}`) | `{{name \|\| login}}`
`failover-name`    | Name  to use if API is not available | The username
`failover-email`   | Email to use if API is not available | Fail if not provided
`github-token`     | The GitHub token used to create an authenticated client | `${{github.token}}`

## 📤 Outputs

Name             | Description                   | Example
:--------------- | :---------------------------- | :--------
<code>user&#8209;json</code> | The GitHub API user object as JSON | <pre lang=json>{"id": 583231, "login": "octocat", "...": ""}</pre>
<code>git&#8209;user&#8209;name</code> | The configured Git `user.name` | `github-actions[bot]`
<code>git&#8209;user&#8209;email</code>| The configured Git `user.email` | `41898282+github-actions[bot]@users.noreply.github.com`

If the API call fails, `user-json` will contain only the `login` field.

## ⚠️ Incident Notice

From `2024-09-16 22:00 UTC` to `2024-09-17 03:00 UTC`, the "Get a User" API endpoint stopped working for `{APP_SLUG}[bot]` queries,
as reported [here](https://github.com/orgs/community/discussions/138861).
This GitHub API issue caused a complete failure of this GitHub Action for such usernames.

To prevent future issues, I added `failover-name` and `failover-email` inputs to set the Git identity to hardcoded values if the API fails again.

```yaml
      - uses: 'actions-rindeal/git-identity-from-username@master'
        with:
          'username': 'github-actions[bot]'
          'failover-email': '41898282+github-actions[bot]@users.noreply.github.com'
```
