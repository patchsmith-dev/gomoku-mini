const { BOARD_SIZE, PLAYERS, createGame, placeStone, undoMove, resetGame, countStones } = window.GomokuEngine;

const boardElement = document.querySelector("#board");
const turnLabel = document.querySelector("#turn-label");
const resultLabel = document.querySelector("#result-label");
const blackCount = document.querySelector("#black-count");
const whiteCount = document.querySelector("#white-count");
const moveCount = document.querySelector("#move-count");
const moveHistory = document.querySelector("#move-history");
const undoButton = document.querySelector("#undo-button");
const resetButton = document.querySelector("#reset-button");

let game = createGame();

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
      cell.disabled = Boolean(value || game.winner || game.isDraw);
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
  renderBoard();
  renderStatus();
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
  undoMove(game);
  render();
}

function handleReset() {
  resetGame(game);
  render();
}

boardElement.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");

  if (!cell) {
    return;
  }

  placeStone(game, Number(cell.dataset.row), Number(cell.dataset.col));
  render();
});

undoButton.addEventListener("click", handleUndo);
resetButton.addEventListener("click", handleReset);

render();
