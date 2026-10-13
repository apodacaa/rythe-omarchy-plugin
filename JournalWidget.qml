import QtQuick
import Quickshell.Io
import qs.Commons
import qs.Ui
import "Model.js" as Model

// Journal nudge for the bar: a book, and "3d" beside it once a day or more has
// passed since the last entry. Dimmed when there's an entry from today.
//
// Left click opens a terminal on a new entry (`journal` with no arguments);
// right click asks `journal status` again. All it knows comes from
// `journal status --json`: counts and dates, never entry text.
//
// When the journal CLI isn't installed it shows "!" and says so in the tooltip,
// and either click checks again.
BarWidget {
  id: root
  moduleName: "maaj.journal"

  // null until the first answer, and again whenever `journal` can't be run.
  property var status: null
  // True once a check has found no `journal` command to run.
  property bool missing: false

  readonly property string journalCommand: String(setting("command", "journal"))
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
    root.bar.run("omarchy-launch-tui --app-id=org.omarchy.journal sh -c '"
      + journalCommand + "; omarchy-shell -q maaj.journal refresh'")
  }

  visible: status !== null || missing
  implicitWidth: button.implicitWidth
  implicitHeight: button.implicitHeight

  IpcHandler {
    target: "maaj.journal"

    function refresh(): void { root.broadcast("refresh") }
    function write(): void { root.write() }
  }

  // Runs before every status call, so the widget can say the CLI is missing
  // instead of vanishing, and notices by itself once it has been installed.
  Process {
    id: whichProc
    command: ["sh", "-c", 'command -v "$1" >/dev/null', "sh", root.journalCommand]
    onExited: function(exitCode) {
      root.missing = exitCode !== 0
      if (root.missing) root.status = null
      else statusProc.running = true
    }
  }

  Process {
    id: statusProc
    command: [root.journalCommand, "status", "--json"]
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
