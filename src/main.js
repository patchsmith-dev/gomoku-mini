const { BOARD_SIZE, PLAYERS, COMPUTER_DIFFICULTIES, chooseComputerMove, createGame, placeStone, undoMove, resetGame, countStones } =
  window.GomokuEngine;

const boardElement = document.querySelector("#board");
const turnLabel = document.querySelector("#turn-label");
const resultLabel = document.querySelector("#result-label");
const blackNameInput = document.querySelector("#black-name-input");
const whiteNameInput = document.querySelector("#white-name-input");
const difficultySelect = document.querySelector("#difficulty-select");
const gameModeInputs = document.querySelectorAll('input[name="game-mode"]');
const blackScoreName = document.querySelector("#black-score-name");
const whiteScoreName = document.querySelector("#white-score-name");
const blackCount = document.querySelector("#black-count");
const whiteCount = document.querySelector("#white-count");
const moveCount = document.querySelector("#move-count");
const moveHistory = document.querySelector("#move-history");
const statusAnnouncer = document.querySelector("#status-announcer");
const recentMatchLabel = document.querySelector("#recent-match-label");
const recentMatchTime = document.querySelector("#recent-match-time");
const clearRecentButton = document.querySelector("#clear-recent-button");
const contrastToggle = document.querySelector("#contrast-toggle");
const timerToggle = document.querySelector("#timer-toggle");
const elapsedTimeLabel = document.querySelector("#elapsed-time-label");
const undoButton = document.querySelector("#undo-button");
const resetButton = document.querySelector("#reset-button");
const MATCH_STORAGE_KEY = "gomoku-mini:recent-match";
const CONTRAST_STORAGE_KEY = "gomoku-mini:high-contrast";
const COMPUTER_PLAYER = "white";

let game = createGame();
let gameMode = "two-player";
let focusPosition = { row: 0, col: 0 };
let lastAnnouncement = "";
let highContrastEnabled = readHighContrastPreference();
let timerEnabled = false;
let timerStartedAt = null;
let timerElapsedMs = 0;
let timerIntervalId = null;

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
  return value ? `${getPlayerName(value)} stone at ${position}` : `Empty cell at ${position}`;
}

function renderStatus() {
  const stoneCounts = countStones(game);

  blackScoreName.textContent = getPlayerName("black");
  whiteScoreName.textContent = getPlayerName("white");
  turnLabel.textContent = getPlayerName(game.currentPlayer);
  resultLabel.textContent = getResultLabel();
  resultLabel.style.color = game.winner ? "var(--danger)" : "inherit";
  blackCount.textContent = String(stoneCounts.black);
  whiteCount.textContent = String(stoneCounts.white);
  moveCount.textContent = String(game.moves.length);
  undoButton.disabled = game.moves.length === 0;

  moveHistory.innerHTML = "";
  game.moves.slice().reverse().forEach((move) => {
    const item = document.createElement("li");
    item.textContent = `${getPlayerName(move.player)}: ${move.row + 1}, ${move.col + 1}`;
    moveHistory.appendChild(item);
  });
}

function render() {
  normalizeFocusPosition();
  renderContrastPreference();
  renderTimerStatus();
  renderComputerOptions();
  renderBoard();
  renderStatus();
  renderRecentMatch();
}

function getResultLabel() {
  if (game.winner) {
    return `${getPlayerName(game.winner)} wins`;
  }

  if (game.isDraw) {
    return "Draw";
  }

  return "Playing";
}

function getPlayerName(player) {
  const input = player === "black" ? blackNameInput : whiteNameInput;
  const fallback = isComputerMode() && player === COMPUTER_PLAYER ? "Computer" : PLAYERS[player];

  return input.value.trim() || fallback;
}

function handleUndo() {
  const result = undoMove(game);

  if (result.ok) {
    focusPosition = { row: result.move.row, col: result.move.col };
    clearAnnouncement();
  }

  if (isComputerMode() && game.currentPlayer === COMPUTER_PLAYER && game.moves.length > 0) {
    const humanMove = undoMove(game);

    if (humanMove.ok) {
      focusPosition = { row: humanMove.move.row, col: humanMove.move.col };
    }
  }

  if (timerEnabled && game.moves.length > 0 && !game.winner && !game.isDraw) {
    startTimerIfNeeded();
  }

  render();
}

function handleReset() {
  resetGame(game);
  focusPosition = { row: 0, col: 0 };
  resetTimer();
  clearAnnouncement();
  render();
}

function handleModeChange(event) {
  gameMode = event.target.value;
  handleReset();
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
    startTimerIfNeeded();
    saveCompletedMatch();
    stopTimerIfGameComplete();
    render();
    focusCell(result.move.row, result.move.col);
    announceGameResult();
    playComputerTurn();
    return;
  }

  focusCell(focusPosition.row, focusPosition.col);
}

function playComputerTurn() {
  if (!isComputerMode() || game.currentPlayer !== COMPUTER_PLAYER || game.winner || game.isDraw) {
    return;
  }

  const move = chooseComputerMove(game, COMPUTER_PLAYER, difficultySelect.value);

  if (!move) {
    return;
  }

  const result = placeStone(game, move.row, move.col);

  if (result.ok) {
    startTimerIfNeeded();
    saveCompletedMatch();
    stopTimerIfGameComplete();
    render();
    focusCell(result.move.row, result.move.col);
    announceGameResult();
  }
}

function isComputerMode() {
  return gameMode === "computer";
}

function renderComputerOptions() {
  const isEnabled = isComputerMode();
  whiteNameInput.placeholder = isEnabled ? "Computer" : "White";
  difficultySelect.disabled = !isEnabled;
  difficultySelect.title = isEnabled ? `${COMPUTER_DIFFICULTIES[difficultySelect.value]} computer` : "Only used in Computer mode";
}

function clearAnnouncement() {
  lastAnnouncement = "";
  statusAnnouncer.textContent = "";
}

function announceGameResult() {
  let announcement = "";

  if (game.winner) {
    announcement = `${getPlayerName(game.winner)} wins after ${game.moves.length} moves.`;
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
    elapsedSeconds: timerEnabled ? Math.floor(getElapsedTimeMs() / 1000) : null,
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

    if (match.elapsedSeconds !== undefined && match.elapsedSeconds !== null && typeof match.elapsedSeconds !== "number") {
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

  recentMatchLabel.textContent = `${match.result} after ${match.moves} moves${formatRecentMatchTime(match)}`;
  recentMatchTime.textContent = formatCompletedAt(match.completedAt);
  recentMatchTime.dateTime = match.completedAt;
  clearRecentButton.disabled = false;
}

function formatRecentMatchTime(match) {
  return typeof match.elapsedSeconds === "number" ? ` in ${formatElapsedTime(match.elapsedSeconds * 1000)}` : "";
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

function readHighContrastPreference() {
  try {
    return window.localStorage.getItem(CONTRAST_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeHighContrastPreference(isEnabled) {
  try {
    window.localStorage.setItem(CONTRAST_STORAGE_KEY, String(isEnabled));
  } catch {
    // Some privacy modes disable localStorage. The visual toggle should still work.
  }
}

function renderContrastPreference() {
  document.body.classList.toggle("high-contrast", highContrastEnabled);
  contrastToggle.checked = highContrastEnabled;
}

function handleContrastChange() {
  highContrastEnabled = contrastToggle.checked;
  writeHighContrastPreference(highContrastEnabled);
  renderContrastPreference();
}

function getElapsedTimeMs() {
  return timerElapsedMs + (timerStartedAt ? Date.now() - timerStartedAt : 0);
}

function formatElapsedTime(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return hours > 0 ? `${hours}:${paddedMinutes}:${paddedSeconds}` : `${paddedMinutes}:${paddedSeconds}`;
}

function renderTimerStatus() {
  timerToggle.checked = timerEnabled;
  elapsedTimeLabel.textContent = timerEnabled ? formatElapsedTime(getElapsedTimeMs()) : "Off";
}

function startTimerIfNeeded() {
  if (!timerEnabled || timerStartedAt || game.winner || game.isDraw) {
    return;
  }

  timerStartedAt = Date.now();
  scheduleTimerTick();
}

function scheduleTimerTick() {
  window.clearInterval(timerIntervalId);
  timerIntervalId = null;

  if (timerEnabled && timerStartedAt && !game.winner && !game.isDraw) {
    timerIntervalId = window.setInterval(renderTimerStatus, 1000);
  }
}

function stopTimer() {
  if (timerStartedAt) {
    timerElapsedMs += Date.now() - timerStartedAt;
    timerStartedAt = null;
  }

  window.clearInterval(timerIntervalId);
  timerIntervalId = null;
  renderTimerStatus();
}

function stopTimerIfGameComplete() {
  if (game.winner || game.isDraw) {
    stopTimer();
  }
}

function resetTimer() {
  stopTimer();
  timerElapsedMs = 0;
  renderTimerStatus();
}

function handleTimerChange() {
  timerEnabled = timerToggle.checked;
  resetTimer();

  if (timerEnabled && game.moves.length > 0 && !game.winner && !game.isDraw) {
    startTimerIfNeeded();
  }
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
contrastToggle.addEventListener("change", handleContrastChange);
timerToggle.addEventListener("change", handleTimerChange);
blackNameInput.addEventListener("input", render);
whiteNameInput.addEventListener("input", render);
difficultySelect.addEventListener("change", render);
gameModeInputs.forEach((input) => input.addEventListener("change", handleModeChange));

render();
