const assert = require("node:assert/strict");
const test = require("node:test");
const engine = require("../src/engine.js");

function playMoves(game, moves) {
  for (const [row, col] of moves) {
    const result = engine.placeStone(game, row, col);
    assert.equal(result.ok, true);
  }
}

test("creates a 15 x 15 game by default", () => {
  const game = engine.createGame();

  assert.equal(game.size, 15);
  assert.equal(game.board.length, 15);
  assert.equal(game.board[0].length, 15);
  assert.equal(game.currentPlayer, "black");
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
