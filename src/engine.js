(function attachEngine(root, factory) {
  const engine = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = engine;
    return;
  }

  root.GomokuEngine = engine;
})(typeof globalThis !== "undefined" ? globalThis : this, function createEngine() {
  const BOARD_SIZE = 15;
  const PLAYERS = {
    black: "Black",
    white: "White",
  };
  const DIRECTIONS = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  function createEmptyBoard(size = BOARD_SIZE) {
    return Array.from({ length: size }, () => Array(size).fill(null));
  }

  function createGame(size = BOARD_SIZE) {
    return {
      size,
      board: createEmptyBoard(size),
      currentPlayer: "black",
      moves: [],
      winner: null,
      winningCells: [],
      isDraw: false,
    };
  }

  function placeStone(game, row, col) {
    if (!isInsideBoard(game, row, col)) {
      return { ok: false, reason: "out-of-bounds" };
    }

    if (game.board[row][col]) {
      return { ok: false, reason: "occupied" };
    }

    if (game.winner || game.isDraw) {
      return { ok: false, reason: "game-over" };
    }

    const player = game.currentPlayer;
    game.board[row][col] = player;
    game.moves.push({ row, col, player });

    const line = findWinningLine(game.board, row, col, player);
    if (line.length >= 5) {
      game.winner = player;
      game.winningCells = line;
    } else if (game.moves.length === game.size * game.size) {
      game.isDraw = true;
    } else {
      game.currentPlayer = nextPlayer(player);
    }

    return { ok: true, move: { row, col, player } };
  }

  function undoMove(game) {
    const lastMove = game.moves.pop();

    if (!lastMove) {
      return { ok: false, reason: "empty-history" };
    }

    game.board[lastMove.row][lastMove.col] = null;
    game.currentPlayer = lastMove.player;
    game.winner = null;
    game.winningCells = [];
    game.isDraw = false;

    return { ok: true, move: lastMove };
  }

  function resetGame(game) {
    const nextGame = createGame(game.size);
    game.board = nextGame.board;
    game.currentPlayer = nextGame.currentPlayer;
    game.moves = nextGame.moves;
    game.winner = nextGame.winner;
    game.winningCells = nextGame.winningCells;
    game.isDraw = nextGame.isDraw;
  }

  function countStones(game) {
    const black = game.moves.filter((move) => move.player === "black").length;
    return {
      black,
      white: game.moves.length - black,
    };
  }

  function findWinningLine(board, row, col, player) {
    for (const [rowStep, colStep] of DIRECTIONS) {
      const line = [
        ...collectCells(board, row, col, player, -rowStep, -colStep).reverse(),
        [row, col],
        ...collectCells(board, row, col, player, rowStep, colStep),
      ];

      if (line.length >= 5) {
        return line;
      }
    }

    return [];
  }

  function collectCells(board, row, col, player, rowStep, colStep) {
    const cells = [];
    let nextRow = row + rowStep;
    let nextCol = col + colStep;

    while (isInsideBoard({ board }, nextRow, nextCol) && board[nextRow][nextCol] === player) {
      cells.push([nextRow, nextCol]);
      nextRow += rowStep;
      nextCol += colStep;
    }

    return cells;
  }

  function isInsideBoard(game, row, col) {
    const size = game.size || game.board.length;
    return Number.isInteger(row) && Number.isInteger(col) && row >= 0 && row < size && col >= 0 && col < size;
  }

  function nextPlayer(player) {
    return player === "black" ? "white" : "black";
  }

  return {
    BOARD_SIZE,
    PLAYERS,
    createEmptyBoard,
    createGame,
    placeStone,
    undoMove,
    resetGame,
    countStones,
    findWinningLine,
    isInsideBoard,
    nextPlayer,
  };
});
