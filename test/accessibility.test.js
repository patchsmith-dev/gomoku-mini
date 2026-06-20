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

test("hint controls are labeled and announced", () => {
  assert.match(htmlSource, /id="hint-button"/);
  assert.match(mainSource, /statusAnnouncer\.textContent = getText\("hintAt"\)/);
  assert.match(styleSource, /\.cell\.hint::before/);
});

test("current position copy action is available", () => {
  assert.match(htmlSource, /id="copy-position-button"/);
  assert.match(htmlSource, /data-i18n="copyPosition"/);
  assert.match(mainSource, /async function copyCurrentPosition\(\)/);
  assert.match(mainSource, /navigator\.clipboard\.writeText\(getCurrentPositionSummary\(\)\)/);
  assert.match(mainSource, /copyPositionButton\.addEventListener\("click", copyCurrentPosition\)/);
});

test("theme selector is labeled and high contrast keeps priority", () => {
  assert.match(htmlSource, /id="theme-select"/);
  assert.match(htmlSource, /data-i18n-aria="theme"/);
  assert.match(mainSource, /document\.body\.classList\.add\(`theme-\$\{theme\}`\)/);
  assert.match(styleSource, /body\.theme-forest/);
  assert.match(styleSource, /body\.theme-midnight/);
  assert.match(styleSource, /body\.high-contrast \.game-surface\s*{\s*background: var\(--panel\);/);
});

test("computer opening selector is labeled", () => {
  assert.match(htmlSource, /id="opening-select"/);
  assert.match(htmlSource, /data-i18n-aria="opening"/);
  assert.match(htmlSource, /value="varied" data-i18n="variedOpening"/);
  assert.match(mainSource, /openingSelect\.disabled = !isEnabled/);
  assert.match(mainSource, /openingStyle: openingSelect\.value/);
});

test("board coordinates are visible but hidden from assistive tech", () => {
  assert.match(htmlSource, /class="board-frame"/);
  assert.match(htmlSource, /class="coord-strip coord-strip-top" aria-hidden="true"/);
  assert.match(htmlSource, /class="coord-strip coord-strip-left" aria-hidden="true"/);
  assert.match(styleSource, /\.board-frame\s*{/);
  assert.match(styleSource, /grid-template-columns: var\(--coord-size\) var\(--board-size\) var\(--coord-size\);/);
  assert.match(styleSource, /\.coord-strip-top,\s*\.coord-strip-bottom/);
});

test("selected board coordinate is exposed near the board", () => {
  assert.match(htmlSource, /class="selected-cell-status" aria-live="polite"/);
  assert.match(htmlSource, /id="selected-cell-label"/);
  assert.match(mainSource, /function renderFocusStatus\(\)/);
  assert.match(mainSource, /selectedCellLabel\.textContent = getBoardCoordinate\(focusPosition\.row, focusPosition\.col\)/);
  assert.match(mainSource, /renderFocusStatus\(\);/);
  assert.match(styleSource, /\.selected-cell-status\s*{/);
});

test("move history entries can refocus board cells", () => {
  assert.match(mainSource, /button\.className = "history-move"/);
  assert.match(mainSource, /button\.setAttribute\("aria-label", getText\("focusMove"\)\(coordinate\)\)/);
  assert.match(mainSource, /moveHistory\.addEventListener\("click"/);
  assert.match(mainSource, /focusCell\(Number\(button\.dataset\.row\), Number\(button\.dataset\.col\)\)/);
  assert.match(styleSource, /\.history-move:hover,\s*\.history-move:focus-visible/);
  assert.match(styleSource, /touch-action: manipulation/);
});

test("reduced motion preference disables stone transition", () => {
  assert.match(styleSource, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styleSource, /\.cell::after\s*{\s*transition: none;/);
});
