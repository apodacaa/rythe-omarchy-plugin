// The manifest's version and the changelog move together, so a release always has its notes.
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"

const read = (name) => readFileSync(new URL("../" + name, import.meta.url), "utf8")
const version = JSON.parse(read("manifest.json")).version

test("the version is three numbers", () => {
  assert.match(version, /^\d+\.\d+\.\d+$/)
})

test("the newest changelog entry is the manifest's version", () => {
  const headings = [...read("CHANGELOG.md").matchAll(/^## (\S+)/gm)].map((m) => m[1])
  assert.equal(headings[0], version, "bump the version and add its changelog entry together")
})
