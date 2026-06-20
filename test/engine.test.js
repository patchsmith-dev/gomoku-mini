const assert = require("node:assert/strict");
const test = require("node:test");
const engine = require("../src/engine.js");

function playMoves(game, moves) {
  for (const [row, col] of moves) {
    const result = engine.placeStone(game, row, col);
    assert.equal(result.ok, true);
  }
}

function setStone(game, row, col, player) {
  game.board[row][col] = player;
  game.moves.push({ row, col, player });
}

test("creates a 15 x 15 game by default", () => {
  const game = engine.createGame();

  assert.equal(game.size, 15);
  assert.equal(game.board.length, 15);
  assert.equal(game.board[0].length, 15);
  assert.equal(game.currentPlayer, "black");
});

test("creates and resets a game with a selected starting player", () => {
  const game = engine.createGame(15, "white");

  assert.equal(game.currentPlayer, "white");
  engine.placeStone(game, 7, 7);
  engine.resetGame(game, "black");

  assert.equal(game.currentPlayer, "black");
  assert.equal(game.moves.length, 0);
  assert.equal(game.board[7][7], null);
});

test("falls back to black for invalid starting players", () => {
  const game = engine.createGame(15, "blue");

  assert.equal(game.currentPlayer, "black");
  assert.equal(engine.normalizePlayer("white"), "white");
  assert.equal(engine.normalizePlayer("blue"), "black");
});

test("rejects invalid or occupied moves", () => {
  const game = engine.createGame();

  assert.equal(engine.placeStone(game, -1, 0).reason, "out-of-bounds");
  assert.equal(engine.placeStone(game, 0, 0).ok, true);
  assert.equal(engine.placeStone(game, 0, 0).reason, "occupied");
});

test("detects a horizontal win", () => {
  const game = engine.createGame();

  playMoves(game, [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
    [0, 2],
    [1, 2],
    [0, 3],
    [1, 3],
    [0, 4],
  ]);

  assert.equal(game.winner, "black");
  assert.equal(game.winningCells.length, 5);
});

test("detects a vertical win", () => {
  const game = engine.createGame();

  playMoves(game, [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
    [2, 0],
    [2, 1],
    [3, 0],
    [3, 1],
    [4, 0],
  ]);

  assert.equal(game.winner, "black");
});

test("detects diagonal wins in both directions", () => {
  const downRight = engine.createGame();
  playMoves(downRight, [
    [0, 0],
    [0, 1],
    [1, 1],
    [0, 2],
    [2, 2],
    [0, 3],
    [3, 3],
    [0, 4],
    [4, 4],
  ]);
  assert.equal(downRight.winner, "black");

  const downLeft = engine.createGame();
  playMoves(downLeft, [
    [0, 4],
    [0, 0],
    [1, 3],
    [0, 1],
    [2, 2],
    [0, 2],
    [3, 1],
    [0, 3],
    [4, 0],
  ]);
  assert.equal(downLeft.winner, "black");
});

test("undo clears a winning state and restores the player turn", () => {
  const game = engine.createGame();

  playMoves(game, [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
    [0, 2],
    [1, 2],
    [0, 3],
    [1, 3],
    [0, 4],
  ]);

  assert.equal(game.winner, "black");
  const result = engine.undoMove(game);

  assert.equal(result.ok, true);
  assert.equal(game.winner, null);
  assert.equal(game.currentPlayer, "black");
  assert.equal(game.moves.length, 8);
});

test("sets isDraw on a full board with no winner", () => {
  const game = engine.createGame(3);

  playMoves(game, [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 1],
    [1, 0],
    [1, 2],
    [2, 1],
    [2, 0],
    [2, 2],
  ]);

  assert.equal(game.winner, null);
  assert.equal(game.isDraw, true);
});

test("rejects moves when the game is already marked as a draw", () => {
  const game = engine.createGame(3);

  game.isDraw = true;

  assert.equal(engine.placeStone(game, 0, 0).reason, "game-over");
});

test("undo after a draw clears isDraw and restores the previous turn", () => {
  const game = engine.createGame(3);

  playMoves(game, [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 1],
    [1, 0],
    [1, 2],
    [2, 1],
    [2, 0],
    [2, 2],
  ]);

  const result = engine.undoMove(game);

  assert.equal(result.ok, true);
  assert.equal(game.isDraw, false);
  assert.equal(game.currentPlayer, "black");
  assert.equal(game.moves.length, 8);
  assert.equal(game.board[2][2], null);
});

test("reset returns the game to the opening state", () => {
  const game = engine.createGame();

  playMoves(game, [
    [0, 0],
    [1, 0],
  ]);
  engine.resetGame(game);

  assert.equal(game.moves.length, 0);
  assert.equal(game.currentPlayer, "black");
  assert.deepEqual(engine.countStones(game), { black: 0, white: 0 });
});

test("computer move opens near the board center", () => {
  const game = engine.createGame();

  assert.deepEqual(engine.chooseComputerMove(game, "white"), { row: 7, col: 7 });
});

test("computer opening can vary near the center", () => {
  const game = engine.createGame();

  assert.deepEqual(engine.chooseComputerMove(game, "white", "normal", { openingStyle: "center" }), { row: 7, col: 7 });
  assert.deepEqual(engine.chooseComputerMove(game, "white", "normal", { openingStyle: "varied", openingIndex: 1 }), {
    row: 6,
    col: 7,
  });
  assert.deepEqual(engine.chooseComputerMove(game, "white", "normal", { openingStyle: "varied", openingIndex: 3 }), {
    row: 8,
    col: 7,
  });
});

test("computer opening is only used on an empty board", () => {
  const game = engine.createGame();

  playMoves(game, [[0, 0]]);

  assert.deepEqual(engine.chooseComputerMove(game, "white", "normal", { openingStyle: "varied", openingIndex: 1 }), {
    row: 1,
    col: 1,
  });
});

test("computer difficulty list includes hard and extreme", () => {
  assert.deepEqual(Object.keys(engine.COMPUTER_DIFFICULTIES).sort(), ["easy", "extreme", "hard", "normal"]);
});

test("computer move takes an immediate win", () => {
  const game = engine.createGame();

  game.board[4][4] = "white";
  game.board[4][5] = "white";
  game.board[4][6] = "white";
  game.board[4][7] = "white";

  assert.deepEqual(engine.chooseComputerMove(game, "white"), { row: 4, col: 3 });
});

test("easy computer difficulty skips tactical search", () => {
  const game = engine.createGame();

  [
    [4, 4],
    [4, 5],
    [4, 6],
    [4, 7],
  ].forEach(([row, col]) => {
    game.board[row][col] = "white";
    game.moves.push({ row, col, player: "white" });
  });

  assert.deepEqual(engine.chooseComputerMove(game, "white", "normal"), { row: 4, col: 3 });
  assert.deepEqual(engine.chooseComputerMove(game, "white", "easy"), { row: 5, col: 7 });
});

test("hard computer difficulty extends the strongest line", () => {
  const game = engine.createGame();

  setStone(game, 7, 7, "white");
  setStone(game, 7, 8, "white");
  setStone(game, 10, 10, "black");

  assert.deepEqual(engine.chooseComputerMove(game, "white", "hard"), { row: 7, col: 6 });
});

test("extreme computer difficulty blocks open-ended three threats", () => {
  const game = engine.createGame();

  setStone(game, 7, 6, "black");
  setStone(game, 7, 7, "black");
  setStone(game, 7, 8, "black");
  setStone(game, 4, 4, "white");

  assert.deepEqual(engine.chooseComputerMove(game, "white", "extreme"), { row: 7, col: 5 });
});

test("computer move blocks an immediate opponent win", () => {
  const game = engine.createGame();

  game.board[8][2] = "black";
  game.board[8][3] = "black";
  game.board[8][4] = "black";
  game.board[8][5] = "black";

  assert.deepEqual(engine.chooseComputerMove(game, "white"), { row: 8, col: 1 });
});

test("computer move stays near existing stones when no tactical move exists", () => {
  const game = engine.createGame();

  playMoves(game, [[0, 0]]);

  assert.deepEqual(engine.chooseComputerMove(game, "white"), { row: 1, col: 1 });
});
