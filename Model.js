// What the bar shows, worked out from `rythe status --json`. Plain functions with no QML in
// them, so `bin/test` can run them under node. Counts and dates only: entry text never gets here.

// The status object, or null if the output isn't one (rythe missing, or it printed an error).
function parse(text) {
  var status
  try {
    status = JSON.parse(text)
  } catch (e) {
    return null
  }
  if (status === null || typeof status !== "object" || Array.isArray(status)) return null
  if (!("days_since" in status)) return null
  return status
}

// Whole days since the last entry, or -1 for an empty journal.
function daysSince(status) {
  if (!status || typeof status.days_since !== "number") return -1
  return Math.max(0, Math.floor(status.days_since))
}

// True when there's an entry from today: nothing to nudge about.
function writtenToday(status) {
  return daysSince(status) === 0
}

// The text beside the icon: "3d" once a day or more has passed, otherwise nothing. `missing` is
// true when the rythe CLI isn't installed, which gets a "!" so the widget says so.
function label(status, missing) {
  if (missing) return "!"
  var days = daysSince(status)
  return days >= 1 ? days + "d" : ""
}

function plural(count, one, many) {
  return count + " " + (count === 1 ? one : many)
}

function tooltip(status, missing) {
  if (missing) return "rythe CLI not installed · click to check again"
  if (!status) return ""
  var days = daysSince(status)
  var parts = []
  if (days < 0) parts.push("No journal entries yet")
  else if (days === 0) parts.push("Wrote today")
  else if (days === 1) parts.push("Last entry yesterday")
  else parts.push("Last entry " + days + " days ago")

  var week = Number(status.week_count) || 0
  if (days >= 0) parts.push(plural(week, "entry", "entries") + " this week")
  return parts.join(" · ")
}
