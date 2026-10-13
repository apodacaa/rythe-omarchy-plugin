# Changelog

What changed in each version, newest first. The version is in `manifest.json`. Versions follow
[semantic versioning](https://semver.org): from 1.0.0 on, a change that breaks the plugin id, an
`omarchy-shell` command or a settings key is a new major version.

## 0.1.0

The first tagged version. Needs `journal` 0.1.0 or later.

- A bar widget showing the days since the last journal entry, dimmed once there's one from today.
- Left click opens a terminal on a new entry; right click refreshes.
- A `!` and a tooltip when the `journal` CLI isn't installed.
- Settings: `interval` and `command`.
- From a script: `omarchy-shell io.github.apodacaa.journal refresh` and `write`.
