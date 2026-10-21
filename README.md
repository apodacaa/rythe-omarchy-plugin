# rythe for the Omarchy bar

A bar widget for [Omarchy](https://omarchy.org)'s shell: a book, and beside it how many days it
has been since the last journal entry. It's a nudge to write, and a one-click way to do it.

| The bar shows | When |
|---|---|
| a dimmed book | there's an entry from today |
| a book and `3d` | the last entry was three days ago |
| a book alone, not dimmed | the journal has no entries yet |
| a book and `!` | the `rythe` CLI isn't installed |
| nothing | `rythe` is installed but `rythe status` failed |

Hovering shows a little more: `Last entry 3 days ago · 2 entries this week`.

- **Left click** opens a terminal on a new entry (plain `rythe`). When the editor closes, the
  widget refreshes, so the count drops straight away.
- **Right click** refreshes now.

While the CLI is missing, the tooltip says so and either click checks again, so the widget picks
it up as soon as it's installed.

Everything comes from `rythe status --json`, which is asked every five minutes. That is counts
and dates only: no entry text or titles ever reach the bar.

## Requirements

- [Omarchy](https://omarchy.org) 4 or later, which is where the plugin system comes from.
- The [`rythe`](https://github.com/apodacaa/rythe) CLI, 0.2.0 or later. The widget is only a view of it: the
  CLI is the journal, and it is not installed with the plugin. With
  [uv](https://docs.astral.sh/uv/):

  ```
  uv tool install git+https://github.com/apodacaa/rythe
  ```

  That puts `rythe` in `~/.local/bin`, which is on the shell's PATH. There is nothing to set up
  after that; `rythe setup` is there if you want to choose where the journal lives.

The two can be installed in either order. Without the CLI the widget shows `!` until it appears.

[CHANGELOG.md](CHANGELOG.md) lists what changed in each version.

## Install

```
omarchy plugin add <git-url-or-path-of-this-repo> --enable
```

That clones this repo into `~/.config/omarchy/plugins/io.github.apodacaa.rythe/`. Later:

```
omarchy plugin update io.github.apodacaa.rythe     # fetch, show the diff, ask, fast-forward
omarchy plugin disable io.github.apodacaa.rythe    # off, files stay
omarchy plugin remove io.github.apodacaa.rythe     # gone
omarchy bar move io.github.apodacaa.rythe --section right
omarchy restart shell                              # if an update doesn't show in the bar
```

## Settings

Optional, in the widget's entry in `~/.config/omarchy/shell.json`:

| Key | Default | What |
|---|---|---|
| `interval` | `300` | seconds between `rythe status` calls (30 at least) |
| `command` | `"rythe"` | the rythe CLI to run |

## From a script

```
omarchy-shell io.github.apodacaa.rythe refresh    # ask rythe status again
omarchy-shell io.github.apodacaa.rythe write      # same as a left click
```

## Licence

MIT. See [LICENSE](LICENSE).
