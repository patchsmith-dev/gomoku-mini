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
