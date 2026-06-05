const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");

const htmlSource = readFileSync(join(__dirname, "..", "index.html"), "utf8");
const mainSource = readFileSync(join(__dirname, "..", "src", "main.js"), "utf8");
const styleSource = readFileSync(join(__dirname, "..", "src", "styles.css"), "utf8");

test("keyboard focus remains visibly styled", () => {
  assert.match(styleSource, /\.cell:hover,\s*\.cell:focus-visible/);
  assert.match(styleSource, /outline:\s*2px solid rgba\(29, 122, 111, 0\.55\)/);
  assert.match(styleSource, /body\.high-contrast \.cell:hover,\s*body\.high-contrast \.cell:focus-visible/);
  assert.match(styleSource, /outline:\s*4px solid #004f46/);
});

test("result announcements use a polite live region", () => {
  assert.match(htmlSource, /id="status-announcer"/);
  assert.match(htmlSource, /aria-live="polite"/);
  assert.match(htmlSource, /aria-atomic="true"/);
  assert.match(mainSource, /statusAnnouncer\.textContent = announcement/);
});

test("latest move is exposed as the current step", () => {
  assert.match(mainSource, /cell\.setAttribute\("aria-current", "step"\)/);
  assert.match(mainSource, /lastMoveStone/);
});
