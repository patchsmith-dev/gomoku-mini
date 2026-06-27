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

test("move labels use board coordinates", () => {
  assert.match(mainSource, /const COLUMN_LABELS = "ABCDEFGHIJKLMNO"\.split\(""\);/);
  assert.match(mainSource, /function getBoardCoordinate\(row, col\)/);
  assert.match(mainSource, /const coordinate = getBoardCoordinate\(move\.row, move\.col\);/);
  assert.match(mainSource, /getText\("moveEntry"\)\(getPlayerName\(move\.player\), coordinate\)/);
  assert.match(mainSource, /getText\("hintAt"\)\(getBoardCoordinate\(move\.row, move\.col\)\)/);
  assert.match(mainSource, /getText\("cellPosition"\)\(getBoardCoordinate\(row, col\), row \+ 1, COLUMN_LABELS\[col\]\)/);
});

test("board coordinate text is localized", () => {
  assert.match(mainSource, /hintAt\(coordinate\)/);
  assert.match(mainSource, /return `Hint: \$\{coordinate\}\.`/);
  assert.match(mainSource, /return `提示：\$\{coordinate\}。`/);
  assert.match(mainSource, /moveEntry\(playerName, coordinate\)/);
  assert.match(mainSource, /focusMove\(coordinate\)/);
  assert.match(mainSource, /return `Focus move at \$\{coordinate\}`/);
  assert.match(mainSource, /return `定位到 \$\{coordinate\}`/);
  assert.match(mainSource, /selectedCell: "Selected"/);
  assert.match(mainSource, /selectedCell: "已选"/);
});

test("recent match copying uses localized summaries", () => {
  assert.match(mainSource, /async function copyRecentMatch\(\)/);
  assert.match(mainSource, /getRecentMatchSummary\(match\)/);
  assert.match(mainSource, /copiedRecentMatch/);
  assert.match(mainSource, /copyRecentMatchFailed/);
});

test("current position copying uses localized summaries", () => {
  assert.match(mainSource, /copyPosition: "Copy Position"/);
  assert.match(mainSource, /copyPosition: "复制局面"/);
  assert.match(mainSource, /copiedPosition: "Current position copied\."/);
  assert.match(mainSource, /copyPositionFailed: "Could not copy the current position\."/);
  assert.match(mainSource, /positionSummary\(\{ result, turn, selected, moves \}\)/);
  assert.match(mainSource, /getCurrentPositionSummary\(\)/);
});

test("move list copying uses localized labels", () => {
  assert.match(mainSource, /copyMoves: "Copy Moves"/);
  assert.match(mainSource, /copyMoves: "复制走子"/);
  assert.match(mainSource, /copiedMoves: "Move list copied\."/);
  assert.match(mainSource, /copyMovesFailed: "Could not copy the move list\."/);
  assert.match(mainSource, /noMovesYet: "No moves yet"/);
  assert.match(mainSource, /getMoveListText\(\)/);
});

test("resign labels are localized", () => {
  assert.match(mainSource, /resign: "Resign"/);
  assert.match(mainSource, /resign: "认输"/);
  assert.match(mainSource, /resigned\(playerName, winnerName\)/);
  assert.match(mainSource, /return `\$\{playerName\} resigned\. \$\{winnerName\} wins\.`/);
  assert.match(mainSource, /return `\$\{playerName\}认输，\$\{winnerName\}获胜。`/);
});

test("move number labels are localized", () => {
  assert.match(mainSource, /moveNumbers: "Move numbers"/);
  assert.match(mainSource, /moveNumbers: "手数"/);
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
  assert.match(mainSource, /hintAt\(coordinate\)/);
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

test("computer opening labels are localized", () => {
  assert.match(mainSource, /opening: "Opening"/);
  assert.match(mainSource, /opening: "开局"/);
  assert.match(mainSource, /centerOpening: "Center"/);
  assert.match(mainSource, /variedOpening: "Varied"/);
  assert.match(mainSource, /centerOpening: "中心"/);
  assert.match(mainSource, /variedOpening: "多变化"/);
  assert.match(mainSource, /openingTitle: "Used when the computer starts as Black"/);
});
