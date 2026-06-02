const BOARD_SIZE = 15;
const PLAYERS = {
  black: "Black",
  white: "White",
};

const boardElement = document.querySelector("#board");
const turnLabel = document.querySelector("#turn-label");
const resultLabel = document.querySelector("#result-label");
const blackCount = document.querySelector("#black-count");
const whiteCount = document.querySelector("#white-count");
const moveCount = document.querySelector("#move-count");
const moveHistory = document.querySelector("#move-history");
const undoButton = document.querySelector("#undo-button");
const resetButton = document.querySelector("#reset-button");

let board = createEmptyBoard();
let currentPlayer = "black";
let moves = [];
let winner = null;
let winningCells = [];

function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

function renderBoard() {
  boardElement.innerHTML = "";

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const cell = document.createElement("button");
      const value = board[row][col];
      const isWinningCell = winningCells.some(([winRow, winCol]) => winRow === row && winCol === col);

      cell.type = "button";
      cell.className = ["cell", value, isWinningCell ? "win" : ""].filter(Boolean).join(" ");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-rowindex", String(row + 1));
      cell.setAttribute("aria-colindex", String(col + 1));
      cell.setAttribute("aria-label", getCellLabel(row, col, value));
      cell.disabled = Boolean(value || winner);
      boardElement.appendChild(cell);
    }
  }
}

function getCellLabel(row, col, value) {
  const position = `row ${row + 1}, column ${col + 1}`;
  return value ? `${PLAYERS[value]} stone at ${position}` : `Empty cell at ${position}`;
}

function renderStatus() {
  const blackMoves = moves.filter((move) => move.player === "black").length;
  const whiteMoves = moves.length - blackMoves;

  turnLabel.textContent = PLAYERS[currentPlayer];
  resultLabel.textContent = winner ? `${PLAYERS[winner]} wins` : "Playing";
  resultLabel.style.color = winner ? "var(--danger)" : "inherit";
  blackCount.textContent = String(blackMoves);
  whiteCount.textContent = String(whiteMoves);
  moveCount.textContent = String(moves.length);
  undoButton.disabled = moves.length === 0;

  moveHistory.innerHTML = "";
  moves.slice().reverse().forEach((move) => {
    const item = document.createElement("li");
    item.textContent = `${PLAYERS[move.player]}: ${move.row + 1}, ${move.col + 1}`;
    moveHistory.appendChild(item);
  });
}

function render() {
  renderBoard();
  renderStatus();
}

function placeStone(row, col) {
  if (board[row][col] || winner) {
    return;
  }

  board[row][col] = currentPlayer;
  moves.push({ row, col, player: currentPlayer });

  const line = findWinningLine(row, col, currentPlayer);
  if (line.length >= 5) {
    winner = currentPlayer;
    winningCells = line;
  } else {
    currentPlayer = currentPlayer === "black" ? "white" : "black";
  }

  render();
}

function findWinningLine(row, col, player) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [rowStep, colStep] of directions) {
    const line = [
      ...collectCells(row, col, player, -rowStep, -colStep).reverse(),
      [row, col],
      ...collectCells(row, col, player, rowStep, colStep),
    ];

    if (line.length >= 5) {
      return line;
    }
  }

  return [];
}

function collectCells(row, col, player, rowStep, colStep) {
  const cells = [];
  let nextRow = row + rowStep;
  let nextCol = col + colStep;

  while (isInsideBoard(nextRow, nextCol) && board[nextRow][nextCol] === player) {
    cells.push([nextRow, nextCol]);
    nextRow += rowStep;
    nextCol += colStep;
  }

  return cells;
}

function isInsideBoard(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function undoMove() {
  const lastMove = moves.pop();

  if (!lastMove) {
    return;
  }

  board[lastMove.row][lastMove.col] = null;
  currentPlayer = lastMove.player;
  winner = null;
  winningCells = [];
  render();
}

function resetGame() {
  board = createEmptyBoard();
  currentPlayer = "black";
  moves = [];
  winner = null;
  winningCells = [];
  render();
}

boardElement.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");

  if (!cell) {
    return;
  }

  placeStone(Number(cell.dataset.row), Number(cell.dataset.col));
});

undoButton.addEventListener("click", undoMove);
resetButton.addEventListener("click", resetGame);

render();
