// The plugin id is written in the manifest and three times in the widget. They have to agree:
// the shell finds the widget's settings by moduleName, and scripts reach it by the IPC target.
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"

const read = (name) => readFileSync(new URL("../" + name, import.meta.url), "utf8")
const id = JSON.parse(read("manifest.json")).id
const qml = read("JournalWidget.qml")

test("the widget's module name and IPC target are the manifest's id", () => {
  assert.match(qml, new RegExp('moduleName: "' + id.replaceAll(".", "\\.") + '"'))
  assert.match(qml, new RegExp('target: "' + id.replaceAll(".", "\\.") + '"'))
})

test("the terminal refreshes the widget by the same id", () => {
  assert.ok(qml.includes("omarchy-shell -q " + id + " refresh"))
})
