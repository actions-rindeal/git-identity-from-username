# Set GitHub App/Bot as Git Config User 🚀

[![Test](https://github.com/actions-rindeal/git-config-user-bot/actions/workflows/test.yml/badge.svg)](https://github.com/actions-rindeal/git-config-user-bot/actions/workflows/test.yml)

Stop copy-pasting `git config user.email 12345+foo[bot]@users...`!<br>
Let this well-tested, robust and performance-optimized GitHub Action handle it for you.

## 📚 Details

Using a GitHub App slug and REST API, it fetches GitHub Bot user details,
then generates and sets proper Git name and email, so that all commits made in your workflow are attributed to this bot.

## 💡 Features

- **Fast**: Performance optimized to complete in just ~200ms.
- **User-Friendly**: Just a single `- uses: 'actions-rindeal/git-config-user-bot@master'` step is all you need in most use cases.
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

      - name: "🤖🔧 Set GitHub App/Bot as Git Config User"
        uses: 'actions-rindeal/git-config-user-bot@master'
        with:
          # 'app-slug': 'your-app-slug' # `github-actions` by default
```

## 📥 Inputs

Name           | Description                                             | Default 
:------------- | :------------------------------------------------------ | :------
`app-slug`     | The GitHub App/Bot slug                                 | `github-actions`
`local`        | Use local Git config instead of global                  | `false`
`github-token` | The GitHub token used to create an authenticated client | `${{github.token}}`

## 📤 Outputs

Name             | Description                   | Example
:--------------- | :---------------------------- | :--------
<code>app&#8209;slug</code> | The GitHub App slug | `github-actions`
<code>bot&#8209;user&#8209;id</code> | The GitHub Bot user ID | `41898282`
<code>bot&#8209;user&#8209;login</code> | The GitHub Bot user login | `github-actions[bot]`
<code>git&#8209;user&#8209;name</code> | The configured Git `user.name` | `github-actions[bot]`
<code>git&#8209;user&#8209;email</code>| The configured Git `user.email` | `41898282+github-actions[bot]@users.noreply.github.com`

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

This project is licensed under the GPL-3.0-only License. See the [LICENSE](LICENSE) file for details.
