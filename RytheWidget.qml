import QtQuick
import Quickshell.Io
import qs.Commons
import qs.Ui
import "Model.js" as Model

// Rythe's nudge for the bar: a book, and "3d" beside it once a day or more has
// passed since the last entry. Dimmed when there's an entry from today.
//
// Left click opens a terminal on a new entry (`rythe` with no arguments);
// right click asks `rythe status` again. All it knows comes from
// `rythe status --json`: counts and dates, never entry text.
//
// When the rythe CLI isn't installed it shows "!" and says so in the tooltip,
// and either click checks again.
BarWidget {
  id: root
  moduleName: "io.github.apodacaa.rythe"

  // null until the first answer, and again whenever `rythe` can't be run.
  property var status: null
  // True once a check has found no `rythe` command to run.
  property bool missing: false

  readonly property string rytheCommand: String(setting("command", "rythe"))
  readonly property int intervalSeconds: Math.max(30, Number(setting("interval", 300)))
  readonly property string countLabel: Model.label(status, missing)

  function refresh() {
    if (!whichProc.running && !statusProc.running) whichProc.running = true
  }

  // The terminal tells this widget to refresh when the editor closes, so the
  // count drops as soon as the entry is saved rather than at the next poll.
  function write() {
    if (missing) {
      refresh()
      return
    }
    if (!root.bar) return
    root.bar.run("omarchy-launch-tui --app-id=org.omarchy.rythe sh -c '"
      + rytheCommand + "; omarchy-shell -q io.github.apodacaa.rythe refresh'")
  }

  visible: status !== null || missing
  implicitWidth: button.implicitWidth
  implicitHeight: button.implicitHeight

  IpcHandler {
    target: "io.github.apodacaa.rythe"

    function refresh(): void { root.broadcast("refresh") }
    function write(): void { root.write() }
  }

  // Runs before every status call, so the widget can say the CLI is missing
  // instead of vanishing, and notices by itself once it has been installed.
  Process {
    id: whichProc
    command: ["sh", "-c", 'command -v "$1" >/dev/null', "sh", root.rytheCommand]
    onExited: function(exitCode) {
      root.missing = exitCode !== 0
      if (root.missing) root.status = null
      else statusProc.running = true
    }
  }

  Process {
    id: statusProc
    command: [root.rytheCommand, "status", "--json"]
    stdout: StdioCollector {
      waitForEnd: true
      onStreamFinished: root.status = Model.parse(text)
    }
    onExited: function(exitCode) {
      if (exitCode !== 0) root.status = null
    }
  }

  Timer {
    interval: root.intervalSeconds * 1000
    running: true
    repeat: true
    triggeredOnStart: true
    onTriggered: root.refresh()
  }

  WidgetButton {
    id: button
    anchors.fill: parent
    bar: root.bar
    text: root.countLabel === "" ? "" : " " + root.countLabel
    dimmed: Model.writtenToday(root.status)
    tooltipText: Model.tooltip(root.status, root.missing)

    onPressed: function(b) {
      if (b === Qt.RightButton) root.refresh()
      else root.write()
    }
  }
}
