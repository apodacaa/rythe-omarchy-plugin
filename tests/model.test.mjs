// Runs Model.js under node. It's a QML script, not a module, so it's loaded into a sandbox.
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import vm from "node:vm"

const Model = {}
vm.createContext(Model)
vm.runInContext(readFileSync(new URL("../Model.js", import.meta.url), "utf8"), Model)

const status = (over) => ({
  last_entry_id: "2026-10-10T195312",
  last_entry_at: "2026-10-10T19:53:12+02:00",
  days_since: 3,
  week_count: 2,
  on_this_day_count: 0,
  ...over,
})
const empty = { last_entry_id: null, last_entry_at: null, days_since: null, week_count: 0, on_this_day_count: 0 }

test("parse accepts a status object and rejects anything else", () => {
  assert.equal(Model.parse(JSON.stringify(status())).days_since, 3)
  assert.equal(Model.parse(JSON.stringify(empty)).days_since, null)
  for (const bad of ["", "rythe: no such command", "[]", "null", "3", '{"other": 1}']) {
    assert.equal(Model.parse(bad), null, bad)
  }
})

test("the label is the day count, and empty for today or an empty journal", () => {
  assert.equal(Model.label(status({ days_since: 0 })), "")
  assert.equal(Model.label(status({ days_since: 1 })), "1d")
  assert.equal(Model.label(status({ days_since: 12 })), "12d")
  assert.equal(Model.label(empty), "")
  assert.equal(Model.label(null), "")
})

test("only an entry from today counts as written today", () => {
  assert.equal(Model.writtenToday(status({ days_since: 0 })), true)
  assert.equal(Model.writtenToday(status({ days_since: 1 })), false)
  assert.equal(Model.writtenToday(empty), false)
  assert.equal(Model.writtenToday(null), false)
})

test("the tooltip says when the last entry was, this week's count, and on-this-day if any", () => {
  assert.equal(Model.tooltip(status({ days_since: 0, week_count: 1 })), "Wrote today · 1 entry this week")
  assert.equal(Model.tooltip(status({ days_since: 1, week_count: 4 })), "Last entry yesterday · 4 entries this week")
  assert.equal(
    Model.tooltip(status({ days_since: 9, week_count: 0, on_this_day_count: 2 })),
    "Last entry 9 days ago · 0 entries this week · 2 on this day",
  )
  assert.equal(Model.tooltip(empty), "No journal entries yet")
  assert.equal(Model.tooltip(null), "")
})

test("a missing CLI gets a mark and a tooltip that says so, whatever the status", () => {
  for (const s of [null, empty, status()]) {
    assert.equal(Model.label(s, true), "!")
    assert.equal(Model.tooltip(s, true), "rythe CLI not installed · click to check again")
  }
  assert.equal(Model.label(status(), false), "3d")
  assert.equal(Model.tooltip(null, false), "")
})

test("nothing in the label or tooltip comes from an entry's id or text", () => {
  const s = status({ last_entry_id: "SECRET-ID", title: "SECRET-TITLE", body: "SECRET-BODY" })
  assert.doesNotMatch(Model.label(s) + Model.tooltip(s), /SECRET/)
})
