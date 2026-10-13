# journal omarchy-plugin

The journal in Omarchy's bar: plugin id `io.github.apodacaa.journal`, one `bar-widget` that shows
the days since the last entry and opens a terminal on a new one. It's for this machine (Omarchy, `omarchy-shell`,
Quickshell/QML). This repo lives in the `~/Work/journal` hub as `omarchy-plugin/`, beside the CLI
in `cli/`; the hub's `CLAUDE.md` has the rules that span the repos.

## Design rules

- **The `journal` CLI is the app; this plugin is a client of it.** It runs
  `journal status --json` and shows the answer. No journal logic in QML: never read entry files,
  never write into the data folder. To create an entry it runs plain `journal` in a terminal.
- **A CLI gap gets fixed in the CLI.** If the widget needs a field `status --json` doesn't give,
  add it in `~/Work/journal/cli` on its own branch with tests, and merge that first.
- **Counts and dates only in the bar.** The bar is visible on screen shares and over a shoulder.
  No entry text, titles or ids in the label or tooltip; a test checks.
- **Logic goes in `Model.js`, wiring in `JournalWidget.qml`.** `Model.js` is plain functions with
  no QML types, so node can test it. The QML file only runs the process, holds the status, and
  binds Model's answers to the button.
- **Polling is slow on purpose.** Every call starts a Python process. The default is five minutes;
  the terminal's `omarchy-shell io.github.apodacaa.journal refresh` covers the moment that matters.
- **Don't name the widget file `BarWidget.qml`.** That is also the name of the base type from
  `qs.Ui`, and qmllint reports an inheritance cycle.
- The upstream reference is `/usr/share/omarchy/shell/plugins/README.md` and the shipped widgets
  beside it (`bar/widgets/SystemUpdate.qml` is the closest model). Read them, never edit them.
  `~/Work/omarchy/notes/plugins.md` explains the plugin system.

## Layout

```
manifest.json        id, kind, entry point; what `omarchy plugin validate` checks
JournalWidget.qml    the widget: Process + Timer + IpcHandler + WidgetButton
Model.js             status JSON -> label, tooltip, written-today
tests/               node tests for Model.js
bin/test             node tests, manifest validation, qmllint
```

## Tests

`bin/test` (on PATH inside this folder through `~/Work/.mise.toml`) runs the node tests, `omarchy
plugin validate .` and qmllint. qmllint can't see every type the shell provides, so its warnings
are noise to read through, not a gate. Nothing here touches the real journal.

What `bin/test` can't cover is the widget inside the running shell. To check that by hand:

- `omarchy plugin list | grep io.github.apodacaa.journal` shows it enabled.
- `omarchy-shell io.github.apodacaa.journal refresh` answers without an error.
- `journalctl --user -b | grep -i io.github.apodacaa.journal` shows QML errors from the shell, if
  any.

## Installed copy

The shell loads `~/.config/omarchy/plugins/io.github.apodacaa.journal/`, which is a git clone of
this repo made by `omarchy plugin add`. Editing here changes nothing in the bar until that clone is updated
(`omarchy plugin update io.github.apodacaa.journal`), and it only sees commits, on the branch it cloned.
Don't edit the installed copy: it gets replaced on update.

An update may not reach the running bar by itself. On 2026-10-13 the shell logged "Local plugin
changed, reloading" after `omarchy plugin update` and kept running the old widget code, through
`omarchy-shell shell rescanPlugins` as well, until `omarchy restart shell`. Restart the shell
before judging a change in the bar.

The id is permanent now that the plugin is headed for the Omarchy plugin list: it names the
install folder, the bar entry in `shell.json` and the `omarchy-shell` target, so changing it breaks
every existing install. `tests/id.test.mjs` checks that the QML uses the manifest's id.

## Working here

Git: GitHub `apodacaa/journal-omarchy-plugin` (private). Work lands on `main` through a pull
request: branch, commit, push, `gh pr create`. The user decides when to merge. Don't commit
straight to `main`.
