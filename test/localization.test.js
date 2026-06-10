const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");

const mainSource = readFileSync(join(__dirname, "..", "src", "main.js"), "utf8");

test("recent match empty state uses the translation table", () => {
  const hardCodedEmptyStateMatches = mainSource.match(/No completed match yet/g) ?? [];

  assert.equal(hardCodedEmptyStateMatches.length, 1);
  assert.match(mainSource, /recentMatchLabel\.textContent = getText\("noCompletedMatch"\);/);
});

test("last move labels are localized", () => {
  assert.match(mainSource, /lastMoveStone\(stoneLabel\)/);
  assert.match(mainSource, /aria-current", "step"/);
  assert.match(mainSource, /getCellLabel\(row, col, value, isLastMove\)/);
});

test("recent match copying uses localized summaries", () => {
  assert.match(mainSource, /async function copyRecentMatch\(\)/);
  assert.match(mainSource, /getRecentMatchSummary\(match\)/);
  assert.match(mainSource, /copiedRecentMatch/);
  assert.match(mainSource, /copyRecentMatchFailed/);
});

test("advanced difficulty labels are localized", () => {
  assert.match(mainSource, /hard: "Hard"/);
  assert.match(mainSource, /extreme: "Extreme"/);
  assert.match(mainSource, /hard: "困难"/);
  assert.match(mainSource, /extreme: "极难"/);
});

test("computer side and hint labels are localized", () => {
  assert.match(mainSource, /computerSide: "Computer side"/);
  assert.match(mainSource, /computerSide: "电脑执子"/);
  assert.match(mainSource, /hint: "Hint"/);
  assert.match(mainSource, /hint: "提示"/);
  assert.match(mainSource, /hintAt\(row, col\)/);
});

test("theme labels are localized", () => {
  assert.match(mainSource, /theme: "Theme"/);
  assert.match(mainSource, /theme: "主题"/);
  assert.match(mainSource, /classicTheme: "Classic"/);
  assert.match(mainSource, /forestTheme: "Forest"/);
  assert.match(mainSource, /midnightTheme: "Midnight"/);
  assert.match(mainSource, /classicTheme: "经典"/);
  assert.match(mainSource, /forestTheme: "林地"/);
  assert.match(mainSource, /midnightTheme: "夜色"/);
});
