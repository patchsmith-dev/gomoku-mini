const { BOARD_SIZE, chooseComputerMove, createGame, placeStone, undoMove, resetGame, countStones } =
  window.GomokuEngine;

const boardElement = document.querySelector("#board");
const turnLabel = document.querySelector("#turn-label");
const resultLabel = document.querySelector("#result-label");
const blackNameInput = document.querySelector("#black-name-input");
const whiteNameInput = document.querySelector("#white-name-input");
const languageSelect = document.querySelector("#language-select");
const themeSelect = document.querySelector("#theme-select");
const difficultySelect = document.querySelector("#difficulty-select");
const openingSelect = document.querySelector("#opening-select");
const gameModeInputs = document.querySelectorAll('input[name="game-mode"]');
const blackScoreName = document.querySelector("#black-score-name");
const whiteScoreName = document.querySelector("#white-score-name");
const blackCount = document.querySelector("#black-count");
const whiteCount = document.querySelector("#white-count");
const moveCount = document.querySelector("#move-count");
const moveHistory = document.querySelector("#move-history");
const selectedCellLabel = document.querySelector("#selected-cell-label");
const statusAnnouncer = document.querySelector("#status-announcer");
const recentMatchLabel = document.querySelector("#recent-match-label");
const recentMatchTime = document.querySelector("#recent-match-time");
const copyRecentButton = document.querySelector("#copy-recent-button");
const clearRecentButton = document.querySelector("#clear-recent-button");
const contrastToggle = document.querySelector("#contrast-toggle");
const timerToggle = document.querySelector("#timer-toggle");
const elapsedTimeLabel = document.querySelector("#elapsed-time-label");
const hintButton = document.querySelector("#hint-button");
const copyPositionButton = document.querySelector("#copy-position-button");
const undoButton = document.querySelector("#undo-button");
const resetButton = document.querySelector("#reset-button");
const computerSideSelect = document.querySelector("#computer-side-select");
const MATCH_STORAGE_KEY = "gomoku-mini:recent-match";
const CONTRAST_STORAGE_KEY = "gomoku-mini:high-contrast";
const LANGUAGE_STORAGE_KEY = "gomoku-mini:language";
const THEME_STORAGE_KEY = "gomoku-mini:theme";
const DEFAULT_COMPUTER_PLAYER = "white";
const DEFAULT_LANGUAGE = "en";
const DEFAULT_THEME = "classic";
const THEMES = ["classic", "forest", "midnight"];
const COLUMN_LABELS = "ABCDEFGHIJKLMNO".split("");
const TRANSLATIONS = {
  en: {
    documentTitle: "Gomoku Mini",
    eyebrow: "Open source board game",
    gameControls: "Game controls",
    board: "Gomoku board",
    gameStatus: "Game status",
    gameSetup: "Game setup",
    gameMode: "Game mode",
    language: "Language",
    theme: "Theme",
    mode: "Mode",
    twoPlayer: "Two Player",
    computer: "Computer",
    black: "Black",
    white: "White",
    difficulty: "Difficulty",
    computerSide: "Computer side",
    opening: "Opening",
    normal: "Normal",
    easy: "Easy",
    hard: "Hard",
    extreme: "Extreme",
    centerOpening: "Center",
    variedOpening: "Varied",
    hint: "Hint",
    copyPosition: "Copy Position",
    classicTheme: "Classic",
    forestTheme: "Forest",
    midnightTheme: "Midnight",
    highContrast: "High contrast",
    timer: "Timer",
    turn: "Turn",
    result: "Result",
    time: "Time",
    moves: "Moves",
    selectedCell: "Selected",
    recentMatch: "Recent Match",
    moveHistory: "Move history",
    noCompletedMatch: "No completed match yet",
    copy: "Copy",
    clear: "Clear",
    undo: "Undo",
    reset: "Reset",
    playing: "Playing",
    draw: "Draw",
    off: "Off",
    onlyComputerMode: "Only used in Computer mode",
    usedForComputerAndHints: "Used for computer moves and hints",
    openingTitle: "Used when the computer starts as Black",
    computerTitle(difficulty) {
      return `${difficulty} computer`;
    },
    hintAt(coordinate) {
      return `Hint: ${coordinate}.`;
    },
    cellPosition(coordinate, row, col) {
      return `${coordinate}, row ${row}, column ${col}`;
    },
    emptyCellAt(position) {
      return `Empty cell at ${position}`;
    },
    stoneAt(playerName, position) {
      return `${playerName} stone at ${position}`;
    },
    lastMoveStone(stoneLabel) {
      return `${stoneLabel}, last move`;
    },
    moveEntry(playerName, coordinate) {
      return `${playerName}: ${coordinate}`;
    },
    focusMove(coordinate) {
      return `Focus move at ${coordinate}`;
    },
    wins(playerName) {
      return `${playerName} wins`;
    },
    winsAfter(playerName, moves) {
      return `${playerName} wins after ${moves} moves.`;
    },
    drawAfter(moves) {
      return `Draw after ${moves} moves.`;
    },
    recentSummary(result, moves, timeText) {
      return `${result} after ${moves} moves${timeText}`;
    },
    timeSuffix(timeText) {
      return ` in ${timeText}`;
    },
    savedRecently: "Saved recently",
    copiedRecentMatch: "Recent match copied.",
    copyRecentMatchFailed: "Could not copy the recent match.",
    copiedPosition: "Current position copied.",
    copyPositionFailed: "Could not copy the current position.",
    positionSummary({ result, turn, selected, moves }) {
      return `Gomoku Mini\nResult: ${result}\nTurn: ${turn}\nSelected: ${selected}\nMoves: ${moves}`;
    },
    savedAt(date) {
      return `Saved ${date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    },
  },
  zh: {
    documentTitle: "Gomoku Mini",
    eyebrow: "开源棋盘游戏",
    gameControls: "游戏控制",
    board: "五子棋棋盘",
    gameStatus: "游戏状态",
    gameSetup: "游戏设置",
    gameMode: "游戏模式",
    language: "语言",
    theme: "主题",
    mode: "模式",
    twoPlayer: "双人",
    computer: "电脑",
    black: "黑方",
    white: "白方",
    difficulty: "难度",
    computerSide: "电脑执子",
    opening: "开局",
    normal: "普通",
    easy: "简单",
    hard: "困难",
    extreme: "极难",
    centerOpening: "中心",
    variedOpening: "多变化",
    hint: "提示",
    copyPosition: "复制局面",
    classicTheme: "经典",
    forestTheme: "林地",
    midnightTheme: "夜色",
    highContrast: "高对比度",
    timer: "计时器",
    turn: "回合",
    result: "结果",
    time: "时间",
    moves: "步数",
    selectedCell: "已选",
    recentMatch: "最近对局",
    moveHistory: "走子记录",
    noCompletedMatch: "暂无已完成对局",
    copy: "复制",
    clear: "清除",
    undo: "悔棋",
    reset: "重置",
    playing: "进行中",
    draw: "平局",
    off: "关闭",
    onlyComputerMode: "仅在电脑模式使用",
    usedForComputerAndHints: "用于电脑走子和提示",
    openingTitle: "电脑执黑先手时使用",
    computerTitle(difficulty) {
      return `${difficulty}电脑`;
    },
    hintAt(coordinate) {
      return `提示：${coordinate}。`;
    },
    cellPosition(coordinate, row, col) {
      return `${coordinate}，第 ${row} 行，${col} 列`;
    },
    emptyCellAt(position) {
      return `空位，${position}`;
    },
    stoneAt(playerName, position) {
      return `${playerName}棋子，${position}`;
    },
    lastMoveStone(stoneLabel) {
      return `${stoneLabel}，最后一手`;
    },
    moveEntry(playerName, coordinate) {
      return `${playerName}：${coordinate}`;
    },
    focusMove(coordinate) {
      return `定位到 ${coordinate}`;
    },
    wins(playerName) {
      return `${playerName}获胜`;
    },
    winsAfter(playerName, moves) {
      return `${playerName}在 ${moves} 手后获胜。`;
    },
    drawAfter(moves) {
      return `平局，共 ${moves} 手。`;
    },
    recentSummary(result, moves, timeText) {
      return `${result}，共 ${moves} 手${timeText}`;
    },
    timeSuffix(timeText) {
      return `，用时 ${timeText}`;
    },
    savedRecently: "刚刚保存",
    copiedRecentMatch: "已复制最近对局。",
    copyRecentMatchFailed: "无法复制最近对局。",
    copiedPosition: "已复制当前局面。",
    copyPositionFailed: "无法复制当前局面。",
    positionSummary({ result, turn, selected, moves }) {
      return `Gomoku Mini\n结果：${result}\n回合：${turn}\n已选：${selected}\n走子：${moves}`;
    },
    savedAt(date) {
      return `已保存 ${date.toLocaleString("zh-CN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    },
  },
};

let game = createGame();
let gameMode = "two-player";
let computerPlayer = DEFAULT_COMPUTER_PLAYER;
let openingIndex = 0;
let focusPosition = { row: 0, col: 0 };
let hintPosition = null;
let lastAnnouncement = "";
let language = readLanguagePreference();
let theme = readThemePreference();
let highContrastEnabled = readHighContrastPreference();
let timerEnabled = false;
let timerStartedAt = null;
let timerElapsedMs = 0;
let timerIntervalId = null;

function renderBoard() {
  boardElement.innerHTML = "";
  const lastMove = game.moves[game.moves.length - 1];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const cell = document.createElement("button");
      const value = game.board[row][col];
      const isWinningCell = game.winningCells.some(([winRow, winCol]) => winRow === row && winCol === col);
      const isLastMove = Boolean(lastMove && lastMove.row === row && lastMove.col === col);
      const isHintedCell = Boolean(hintPosition && hintPosition.row === row && hintPosition.col === col && !value);

      cell.type = "button";
      cell.className = ["cell", value, isWinningCell ? "win" : "", isLastMove ? "last-move" : "", isHintedCell ? "hint" : ""]
        .filter(Boolean)
        .join(" ");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-rowindex", String(row + 1));
      cell.setAttribute("aria-colindex", String(col + 1));
      cell.setAttribute("aria-label", getCellLabel(row, col, value, isLastMove));
      cell.setAttribute("aria-disabled", String(Boolean(value || game.winner || game.isDraw)));
      if (isLastMove) {
        cell.setAttribute("aria-current", "step");
      }
      cell.tabIndex = isFocusedCell(row, col) ? 0 : -1;
      boardElement.appendChild(cell);
    }
  }
}

function getCellLabel(row, col, value, isLastMove = false) {
  const position = getText("cellPosition")(getBoardCoordinate(row, col), row + 1, COLUMN_LABELS[col]);
  if (!value) {
    return getText("emptyCellAt")(position);
  }

  const stoneLabel = getText("stoneAt")(getPlayerName(value), position);
  return isLastMove ? getText("lastMoveStone")(stoneLabel) : stoneLabel;
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
  hintButton.disabled = Boolean(game.winner || game.isDraw || isComputerTurn());
  undoButton.disabled = game.moves.length === 0;

  moveHistory.innerHTML = "";
  game.moves.slice().reverse().forEach((move) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    const coordinate = getBoardCoordinate(move.row, move.col);

    button.type = "button";
    button.className = "history-move";
    button.dataset.row = move.row;
    button.dataset.col = move.col;
    button.textContent = getText("moveEntry")(getPlayerName(move.player), coordinate);
    button.setAttribute("aria-label", getText("focusMove")(coordinate));
    item.appendChild(button);
    moveHistory.appendChild(item);
  });
}

function getBoardCoordinate(row, col) {
  return `${COLUMN_LABELS[col] ?? "?"}${row + 1}`;
}

function render() {
  normalizeFocusPosition();
  renderLanguage();
  renderThemePreference();
  renderContrastPreference();
  renderTimerStatus();
  renderComputerOptions();
  renderBoard();
  renderStatus();
  renderFocusStatus();
  renderRecentMatch();
}

function getText(key) {
  return TRANSLATIONS[language][key] ?? TRANSLATIONS[DEFAULT_LANGUAGE][key];
}

function renderLanguage() {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.title = getText("documentTitle");
  languageSelect.value = language;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = getText(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", getText(element.dataset.i18nAria));
  });
}

function getResultLabel() {
  if (game.winner) {
    return getText("wins")(getPlayerName(game.winner));
  }

  if (game.isDraw) {
    return getText("draw");
  }

  return getText("playing");
}

function getPlayerName(player) {
  const input = player === "black" ? blackNameInput : whiteNameInput;
  const fallback = isComputerMode() && player === computerPlayer ? getText("computer") : getText(player);

  return input.value.trim() || fallback;
}

function handleUndo() {
  const result = undoMove(game);

  if (result.ok) {
    focusPosition = { row: result.move.row, col: result.move.col };
    hintPosition = null;
    clearAnnouncement();
  }

  if (isComputerMode() && result.ok && result.move.player === computerPlayer && game.moves.length > 0) {
    const pairedMove = undoMove(game);

    if (pairedMove.ok) {
      focusPosition = { row: pairedMove.move.row, col: pairedMove.move.col };
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
  hintPosition = null;
  resetTimer();
  clearAnnouncement();
  render();
  playComputerTurn();
  openingIndex += 1;
}

function handleModeChange(event) {
  gameMode = event.target.value;
  handleReset();
}

function handleComputerSideChange() {
  computerPlayer = computerSideSelect.value === "black" ? "black" : DEFAULT_COMPUTER_PLAYER;
  handleReset();
}

function handleOpeningChange() {
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
  renderFocusStatus();
}

function renderFocusStatus() {
  selectedCellLabel.textContent = getBoardCoordinate(focusPosition.row, focusPosition.col);
}

function playFocusedCell() {
  if (isComputerTurn()) {
    return;
  }

  const result = placeStone(game, focusPosition.row, focusPosition.col);

  if (result.ok) {
    hintPosition = null;
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
  if (!isComputerTurn() || game.winner || game.isDraw) {
    return;
  }

  const move = chooseComputerMove(game, computerPlayer, difficultySelect.value, {
    openingStyle: openingSelect.value,
    openingIndex,
  });

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

function isComputerTurn() {
  return isComputerMode() && game.currentPlayer === computerPlayer;
}

function renderComputerOptions() {
  const isEnabled = isComputerMode();
  blackNameInput.placeholder = isEnabled && computerPlayer === "black" ? getText("computer") : getText("black");
  whiteNameInput.placeholder = isEnabled && computerPlayer === "white" ? getText("computer") : getText("white");
  computerSideSelect.value = computerPlayer;
  computerSideSelect.disabled = !isEnabled;
  computerSideSelect.title = isEnabled ? getText("computerSide") : getText("onlyComputerMode");
  openingSelect.disabled = !isEnabled;
  openingSelect.title = isEnabled ? getText("openingTitle") : getText("onlyComputerMode");
  difficultySelect.title = getText("usedForComputerAndHints");
}

function showHint() {
  if (game.winner || game.isDraw || isComputerTurn()) {
    return;
  }

  const move = chooseComputerMove(game, game.currentPlayer, difficultySelect.value);

  if (!move) {
    return;
  }

  hintPosition = move;
  statusAnnouncer.textContent = getText("hintAt")(getBoardCoordinate(move.row, move.col));
  render();
  focusCell(move.row, move.col);
}

function clearAnnouncement() {
  lastAnnouncement = "";
  statusAnnouncer.textContent = "";
}

function announceGameResult() {
  let announcement = "";

  if (game.winner) {
    announcement = getText("winsAfter")(getPlayerName(game.winner), game.moves.length);
  } else if (game.isDraw) {
    announcement = getText("drawAfter")(game.moves.length);
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
    resultType: game.winner ? "win" : "draw",
    winner: game.winner,
    winnerName: game.winner ? getPlayerName(game.winner) : null,
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

    if (match.resultType !== undefined && !["win", "draw"].includes(match.resultType)) {
      return null;
    }

    if (match.winner !== undefined && match.winner !== null && !["black", "white"].includes(match.winner)) {
      return null;
    }

    if (match.winnerName !== undefined && match.winnerName !== null && typeof match.winnerName !== "string") {
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
    recentMatchLabel.textContent = getText("noCompletedMatch");
    recentMatchTime.textContent = "";
    recentMatchTime.dateTime = "";
    copyRecentButton.disabled = true;
    clearRecentButton.disabled = true;
    return;
  }

  recentMatchLabel.textContent = getRecentMatchSummary(match);
  recentMatchTime.textContent = formatCompletedAt(match.completedAt);
  recentMatchTime.dateTime = match.completedAt;
  copyRecentButton.disabled = false;
  clearRecentButton.disabled = false;
}

function getRecentMatchSummary(match) {
  return getText("recentSummary")(getRecentMatchResult(match), match.moves, formatRecentMatchTime(match));
}

function getRecentMatchResult(match) {
  if (match.resultType === "draw") {
    return getText("draw");
  }

  if (match.resultType === "win" && match.winner) {
    return getText("wins")(getSavedWinnerName(match));
  }

  return match.result;
}

function getSavedWinnerName(match) {
  if (!match.winnerName || match.winnerName === TRANSLATIONS.en[match.winner] || match.winnerName === TRANSLATIONS.zh[match.winner]) {
    return getText(match.winner);
  }

  if (match.winnerName === TRANSLATIONS.en.computer || match.winnerName === TRANSLATIONS.zh.computer) {
    return getText("computer");
  }

  return match.winnerName;
}

function formatRecentMatchTime(match) {
  return typeof match.elapsedSeconds === "number" ? getText("timeSuffix")(formatElapsedTime(match.elapsedSeconds * 1000)) : "";
}

function formatCompletedAt(completedAt) {
  const date = new Date(completedAt);

  if (Number.isNaN(date.getTime())) {
    return getText("savedRecently");
  }

  return getText("savedAt")(date);
}

async function copyRecentMatch() {
  const match = readRecentMatch();

  if (!match || !navigator.clipboard?.writeText) {
    statusAnnouncer.textContent = getText("copyRecentMatchFailed");
    return;
  }

  try {
    const summaryParts = [getRecentMatchSummary(match), formatCompletedAt(match.completedAt)].filter(Boolean);
    await navigator.clipboard.writeText(summaryParts.join(" - "));
    statusAnnouncer.textContent = getText("copiedRecentMatch");
  } catch {
    statusAnnouncer.textContent = getText("copyRecentMatchFailed");
  }
}

async function copyCurrentPosition() {
  if (!navigator.clipboard?.writeText) {
    statusAnnouncer.textContent = getText("copyPositionFailed");
    return;
  }

  try {
    await navigator.clipboard.writeText(getCurrentPositionSummary());
    statusAnnouncer.textContent = getText("copiedPosition");
  } catch {
    statusAnnouncer.textContent = getText("copyPositionFailed");
  }
}

function getCurrentPositionSummary() {
  const moveText = game.moves
    .map((move, index) => `${index + 1}. ${getText("moveEntry")(getPlayerName(move.player), getBoardCoordinate(move.row, move.col))}`)
    .join(" ");

  return getText("positionSummary")({
    result: getResultLabel(),
    turn: getPlayerName(game.currentPlayer),
    selected: getBoardCoordinate(focusPosition.row, focusPosition.col),
    moves: moveText || getText("noCompletedMatch"),
  });
}

function readHighContrastPreference() {
  try {
    return window.localStorage.getItem(CONTRAST_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function readLanguagePreference() {
  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return Object.hasOwn(TRANSLATIONS, storedLanguage) ? storedLanguage : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function readThemePreference() {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.includes(storedTheme) ? storedTheme : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function writeLanguagePreference(nextLanguage) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  } catch {
    // Some privacy modes disable localStorage. Language switching should still work.
  }
}

function writeThemePreference(nextTheme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch {
    // Some privacy modes disable localStorage. Theme switching should still work.
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

function renderThemePreference() {
  document.body.classList.remove(...THEMES.map((themeName) => `theme-${themeName}`));
  document.body.classList.add(`theme-${theme}`);
  themeSelect.value = theme;
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
  elapsedTimeLabel.textContent = timerEnabled ? formatElapsedTime(getElapsedTimeMs()) : getText("off");
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

function handleLanguageChange() {
  language = Object.hasOwn(TRANSLATIONS, languageSelect.value) ? languageSelect.value : DEFAULT_LANGUAGE;
  writeLanguagePreference(language);
  render();
}

function handleThemeChange() {
  theme = THEMES.includes(themeSelect.value) ? themeSelect.value : DEFAULT_THEME;
  writeThemePreference(theme);
  renderThemePreference();
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

moveHistory.addEventListener("click", (event) => {
  const button = event.target.closest(".history-move");

  if (!button) {
    return;
  }

  focusCell(Number(button.dataset.row), Number(button.dataset.col));
});

undoButton.addEventListener("click", handleUndo);
resetButton.addEventListener("click", handleReset);
copyPositionButton.addEventListener("click", copyCurrentPosition);
copyRecentButton.addEventListener("click", copyRecentMatch);
clearRecentButton.addEventListener("click", clearRecentMatch);
contrastToggle.addEventListener("change", handleContrastChange);
timerToggle.addEventListener("change", handleTimerChange);
languageSelect.addEventListener("change", handleLanguageChange);
themeSelect.addEventListener("change", handleThemeChange);
blackNameInput.addEventListener("input", render);
whiteNameInput.addEventListener("input", render);
difficultySelect.addEventListener("change", render);
computerSideSelect.addEventListener("change", handleComputerSideChange);
openingSelect.addEventListener("change", handleOpeningChange);
hintButton.addEventListener("click", showHint);
gameModeInputs.forEach((input) => input.addEventListener("change", handleModeChange));

render();
