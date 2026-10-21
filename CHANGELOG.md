# Changelog

What changed in each version, newest first. The version is in `manifest.json`. Versions follow
[semantic versioning](https://semver.org): from 1.0.0 on, a change that breaks the plugin id, an
`omarchy-shell` command or a settings key is a new major version.

## 0.3.0

**The tooltip no longer says "N on this day"**, following `rythe` 0.3.0, which removed "on this day"
(nothing in the journaling research shows that being shown old entries helps, and it can feed
rumination). Works with `rythe` 0.2.0 or later: an older CLI's extra `on_this_day_count` field is ignored.

## 0.2.0

**Renamed to rythe**, following the CLI, which is now `rythe` (a rythe is a small stream; say
"rye-th"). Needs `rythe` 0.2.0 or later.

- The plugin id is `io.github.apodacaa.rythe`, so the commands are
  `omarchy-shell io.github.apodacaa.rythe refresh` and `write`.
- The widget runs the `rythe` command by default, and is listed as "Rythe".
- The repository is `apodacaa/rythe-omarchy-plugin`.

Because the id names the install folder and the bar entry, an existing install has to be removed
and added again; `omarchy plugin update` is not enough.

## 0.1.0

Released under the id `io.github.apodacaa.journal`; the names below are as they were then.


The first tagged version. Needs `journal` 0.1.0 or later.

- A bar widget showing the days since the last journal entry, dimmed once there's one from today.
- Left click opens a terminal on a new entry; right click refreshes.
- A `!` and a tooltip when the `journal` CLI isn't installed.
- Settings: `interval` and `command`.
- From a script: `omarchy-shell io.github.apodacaa.journal refresh` and `write`.
