# journal for the Omarchy bar

A bar widget for [Omarchy](https://omarchy.org)'s shell: a book, and beside it how many days it
has been since the last journal entry. It's a nudge to write, and a one-click way to do it.

| The bar shows | When |
|---|---|
| a dimmed book | there's an entry from today |
| a book and `3d` | the last entry was three days ago |
| a book alone, not dimmed | the journal has no entries yet |
| a book and `!` | the `journal` CLI isn't installed |
| nothing | `journal` is installed but `journal status` failed |

Hovering shows a little more: `Last entry 3 days ago · 2 entries this week · 1 on this day`.

- **Left click** opens a terminal on a new entry (plain `journal`). When the editor closes, the
  widget refreshes, so the count drops straight away.
- **Right click** refreshes now.

While the CLI is missing, the tooltip says so and either click checks again, so the widget picks
it up as soon as it's installed.

Everything comes from `journal status --json`, which is asked every five minutes. That is counts
and dates only: no entry text or titles ever reach the bar.

## Install

It needs the `journal` CLI on the shell's PATH (`~/.local/bin` is).

```
omarchy plugin add <git-url-or-path-of-this-repo> --enable
```

That clones this repo into `~/.config/omarchy/plugins/maaj.journal/`. Later:

```
omarchy plugin update maaj.journal     # fetch, show the diff, ask, fast-forward
omarchy plugin disable maaj.journal    # off, files stay
omarchy plugin remove maaj.journal     # gone
omarchy bar move maaj.journal --section right
```

## Settings

Optional, in the widget's entry in `~/.config/omarchy/shell.json`:

| Key | Default | What |
|---|---|---|
| `interval` | `300` | seconds between `journal status` calls (30 at least) |
| `command` | `"journal"` | the journal CLI to run |

## From a script

```
omarchy-shell maaj.journal refresh    # ask journal status again
omarchy-shell maaj.journal write      # same as a left click
```
