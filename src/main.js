const { BOARD_SIZE, PLAYERS, createGame, placeStone, undoMove, resetGame, countStones } = window.GomokuEngine;

const boardElement = document.querySelector("#board");
const turnLabel = document.querySelector("#turn-label");
const resultLabel = document.querySelector("#result-label");
const blackCount = document.querySelector("#black-count");
const whiteCount = document.querySelector("#white-count");
const moveCount = document.querySelector("#move-count");
const moveHistory = document.querySelector("#move-history");
const statusAnnouncer = document.querySelector("#status-announcer");
const recentMatchLabel = document.querySelector("#recent-match-label");
const recentMatchTime = document.querySelector("#recent-match-time");
const clearRecentButton = document.querySelector("#clear-recent-button");
const undoButton = document.querySelector("#undo-button");
const resetButton = document.querySelector("#reset-button");
const MATCH_STORAGE_KEY = "gomoku-mini:recent-match";

let game = createGame();
let focusPosition = { row: 0, col: 0 };
let lastAnnouncement = "";

function renderBoard() {
  boardElement.innerHTML = "";

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const cell = document.createElement("button");
      const value = game.board[row][col];
      const isWinningCell = game.winningCells.some(([winRow, winCol]) => winRow === row && winCol === col);

      cell.type = "button";
      cell.className = ["cell", value, isWinningCell ? "win" : ""].filter(Boolean).join(" ");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-rowindex", String(row + 1));
      cell.setAttribute("aria-colindex", String(col + 1));
      cell.setAttribute("aria-label", getCellLabel(row, col, value));
      cell.setAttribute("aria-disabled", String(Boolean(value || game.winner || game.isDraw)));
      cell.tabIndex = isFocusedCell(row, col) ? 0 : -1;
      boardElement.appendChild(cell);
    }
  }
}

function getCellLabel(row, col, value) {
  const position = `row ${row + 1}, column ${col + 1}`;
  return value ? `${PLAYERS[value]} stone at ${position}` : `Empty cell at ${position}`;
}

function renderStatus() {
  const stoneCounts = countStones(game);

  turnLabel.textContent = PLAYERS[game.currentPlayer];
  resultLabel.textContent = getResultLabel();
  resultLabel.style.color = game.winner ? "var(--danger)" : "inherit";
  blackCount.textContent = String(stoneCounts.black);
  whiteCount.textContent = String(stoneCounts.white);
  moveCount.textContent = String(game.moves.length);
  undoButton.disabled = game.moves.length === 0;

  moveHistory.innerHTML = "";
  game.moves.slice().reverse().forEach((move) => {
    const item = document.createElement("li");
    item.textContent = `${PLAYERS[move.player]}: ${move.row + 1}, ${move.col + 1}`;
    moveHistory.appendChild(item);
  });
}

function render() {
  normalizeFocusPosition();
  renderBoard();
  renderStatus();
  renderRecentMatch();
}

function getResultLabel() {
  if (game.winner) {
    return `${PLAYERS[game.winner]} wins`;
  }

  if (game.isDraw) {
    return "Draw";
  }

  return "Playing";
}

function handleUndo() {
  const result = undoMove(game);

  if (result.ok) {
    focusPosition = { row: result.move.row, col: result.move.col };
    clearAnnouncement();
  }

  render();
}

function handleReset() {
  resetGame(game);
  focusPosition = { row: 0, col: 0 };
  clearAnnouncement();
  render();
}

function isFocusedCell(row, col) {
  return focusPosition.row === row && focusPosition.col === col;
}

function normalizeFocusPosition() {
  focusPosition = {
    row: Math.min(Math.max(focusPosition.row, 0), BOARD_SIZE - 1),
    col: Math.min(Math.max(focusPosition.col, 0), BOARD_SIZE - 1),
  };
}

function getCell(row, col) {
  return boardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

function focusCell(row, col) {
  focusPosition = {
    row: Math.min(Math.max(row, 0), BOARD_SIZE - 1),
    col: Math.min(Math.max(col, 0), BOARD_SIZE - 1),
  };

  boardElement.querySelectorAll(".cell").forEach((cell) => {
    cell.tabIndex = isFocusedCell(Number(cell.dataset.row), Number(cell.dataset.col)) ? 0 : -1;
  });

  getCell(focusPosition.row, focusPosition.col)?.focus();
}

function playFocusedCell() {
  const result = placeStone(game, focusPosition.row, focusPosition.col);

  if (result.ok) {
    saveCompletedMatch();
    render();
    focusCell(result.move.row, result.move.col);
    announceGameResult();
    return;
  }

  focusCell(focusPosition.row, focusPosition.col);
}

function clearAnnouncement() {
  lastAnnouncement = "";
  statusAnnouncer.textContent = "";
}

function announceGameResult() {
  let announcement = "";

  if (game.winner) {
    announcement = `${PLAYERS[game.winner]} wins after ${game.moves.length} moves.`;
  } else if (game.isDraw) {
    announcement = `Draw after ${game.moves.length} moves.`;
  }

  if (announcement && announcement !== lastAnnouncement) {
    statusAnnouncer.textContent = announcement;
    lastAnnouncement = announcement;
  }
}

function saveCompletedMatch() {
  if (!game.winner && !game.isDraw) {
    return;
  }

  writeRecentMatch({
    completedAt: new Date().toISOString(),
    moves: game.moves.length,
    result: getResultLabel(),
  });
}

function readRecentMatch() {
  try {
    const storedMatch = window.localStorage.getItem(MATCH_STORAGE_KEY);

    if (!storedMatch) {
      return null;
    }

    const match = JSON.parse(storedMatch);

    if (typeof match.result !== "string" || typeof match.moves !== "number" || typeof match.completedAt !== "string") {
      return null;
    }

    return match;
  } catch {
    return null;
  }
}

function writeRecentMatch(match) {
  try {
    window.localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify(match));
  } catch {
    // Some privacy modes disable localStorage. The game should keep working.
  }
}

function clearRecentMatch() {
  try {
    window.localStorage.removeItem(MATCH_STORAGE_KEY);
  } catch {
    // Ignore storage failures; the UI will fall back to the empty state.
  }

  renderRecentMatch();
}

function renderRecentMatch() {
  const match = readRecentMatch();

  if (!match) {
    recentMatchLabel.textContent = "No completed match yet";
    recentMatchTime.textContent = "";
    recentMatchTime.dateTime = "";
    clearRecentButton.disabled = true;
    return;
  }

  recentMatchLabel.textContent = `${match.result} after ${match.moves} moves`;
  recentMatchTime.textContent = formatCompletedAt(match.completedAt);
  recentMatchTime.dateTime = match.completedAt;
  clearRecentButton.disabled = false;
}

function formatCompletedAt(completedAt) {
  const date = new Date(completedAt);

  if (Number.isNaN(date.getTime())) {
    return "Saved recently";
  }

  return `Saved ${date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

boardElement.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");

  if (!cell) {
    return;
  }

  focusPosition = {
    row: Number(cell.dataset.row),
    col: Number(cell.dataset.col),
  };
  playFocusedCell();
});

boardElement.addEventListener("keydown", (event) => {
  const cell = event.target.closest(".cell");

  if (!cell) {
    return;
  }

  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  const keyActions = {
    ArrowUp: () => focusCell(row - 1, col),
    ArrowDown: () => focusCell(row + 1, col),
    ArrowLeft: () => focusCell(row, col - 1),
    ArrowRight: () => focusCell(row, col + 1),
    Home: () => focusCell(row, 0),
    End: () => focusCell(row, BOARD_SIZE - 1),
    Enter: playFocusedCell,
    " ": playFocusedCell,
  };
  const action = keyActions[event.key];

  if (!action) {
    return;
  }

  event.preventDefault();
  action();
});

undoButton.addEventListener("click", handleUndo);
resetButton.addEventListener("click", handleReset);
clearRecentButton.addEventListener("click", clearRecentMatch);

render();
