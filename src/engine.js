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
  const COMPUTER_DIFFICULTIES = {
    easy: "Easy",
    normal: "Normal",
    hard: "Hard",
    extreme: "Extreme",
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

  function chooseComputerMove(game, player = "white", difficulty = "normal") {
    if (game.winner || game.isDraw) {
      return null;
    }

    const selectedDifficulty = Object.hasOwn(COMPUTER_DIFFICULTIES, difficulty) ? difficulty : "normal";

    if (selectedDifficulty === "easy") {
      return chooseNearbyMove(game);
    }

    const winningMove = findImmediateMove(game, player);
    if (winningMove) {
      return winningMove;
    }

    const blockingMove = findImmediateMove(game, nextPlayer(player));
    if (blockingMove) {
      return blockingMove;
    }

    if (selectedDifficulty === "hard") {
      return chooseScoredMove(game, player, {
        defenseWeight: 0.75,
        lookaheadWeight: 0,
      });
    }

    if (selectedDifficulty === "extreme") {
      return chooseScoredMove(game, player, {
        defenseWeight: 1.15,
        lookaheadWeight: 0.45,
      });
    }

    return chooseNearbyMove(game);
  }

  function findImmediateMove(game, player) {
    for (const [row, col] of getOpenCells(game)) {
      game.board[row][col] = player;
      const isWinningMove = findWinningLine(game.board, row, col, player).length >= 5;
      game.board[row][col] = null;

      if (isWinningMove) {
        return { row, col };
      }
    }

    return null;
  }

  function chooseNearbyMove(game) {
    const openCells = getOpenCells(game);

    if (openCells.length === 0) {
      return null;
    }

    const occupiedCells = getOccupiedCells(game);
    const candidates = occupiedCells.length
      ? openCells.filter(([row, col]) =>
          occupiedCells.some(([occupiedRow, occupiedCol]) => {
            const rowDistance = Math.abs(row - occupiedRow);
            const colDistance = Math.abs(col - occupiedCol);

            return Math.max(rowDistance, colDistance) === 1;
          }),
        )
      : openCells;
    const rankedCandidates = candidates.length ? candidates : openCells;
    const center = (game.size - 1) / 2;

    rankedCandidates.sort(([rowA, colA], [rowB, colB]) => {
      const distanceA = (rowA - center) ** 2 + (colA - center) ** 2;
      const distanceB = (rowB - center) ** 2 + (colB - center) ** 2;

      return distanceA - distanceB || rowA - rowB || colA - colB;
    });

    const [row, col] = rankedCandidates[0];
    return { row, col };
  }

  function chooseScoredMove(game, player, options) {
    const candidates = getCandidateCells(game, 2);
    const rankedCandidates = candidates.map(([row, col]) => ({
      row,
      col,
      score: scoreComputerCandidate(game, row, col, player, options),
    }));

    rankedCandidates.sort((moveA, moveB) => compareRankedMoves(game, moveA, moveB));

    const bestMove = rankedCandidates[0];
    return bestMove ? { row: bestMove.row, col: bestMove.col } : null;
  }

  function scoreComputerCandidate(game, row, col, player, { defenseWeight, lookaheadWeight }) {
    const opponent = nextPlayer(player);
    let score = scoreCandidate(game, row, col, player) + scoreCandidate(game, row, col, opponent) * defenseWeight;

    if (lookaheadWeight > 0) {
      game.board[row][col] = player;
      score -= getBestCandidateScore(game, opponent) * lookaheadWeight;
      game.board[row][col] = null;
    }

    return score;
  }

  function getBestCandidateScore(game, player) {
    const candidates = getCandidateCells(game, 2);

    return candidates.reduce((bestScore, [row, col]) => Math.max(bestScore, scoreCandidate(game, row, col, player)), 0);
  }

  function scoreCandidate(game, row, col, player) {
    if (game.board[row][col]) {
      return Number.NEGATIVE_INFINITY;
    }

    game.board[row][col] = player;
    const profiles = DIRECTIONS.map(([rowStep, colStep]) => getLineProfile(game.board, row, col, player, rowStep, colStep));
    game.board[row][col] = null;

    const lineScore = profiles.reduce((score, profile) => score + profile.score, 0);
    const strongLineCount = profiles.filter((profile) => isStrongLine(profile)).length;
    const forkBonus = strongLineCount >= 2 ? strongLineCount * 2500 : 0;

    return lineScore + forkBonus;
  }

  function getLineProfile(board, row, col, player, rowStep, colStep) {
    const forward = countLineDirection(board, row, col, player, rowStep, colStep);
    const backward = countLineDirection(board, row, col, player, -rowStep, -colStep);
    const stones = forward.count + backward.count + 1;
    const openEnds = Number(forward.isOpen) + Number(backward.isOpen);

    return {
      stones,
      openEnds,
      score: scoreLine(stones, openEnds),
    };
  }

  function countLineDirection(board, row, col, player, rowStep, colStep) {
    let count = 0;
    let nextRow = row + rowStep;
    let nextCol = col + colStep;

    while (isInsideBoard({ board }, nextRow, nextCol) && board[nextRow][nextCol] === player) {
      count += 1;
      nextRow += rowStep;
      nextCol += colStep;
    }

    return {
      count,
      isOpen: isInsideBoard({ board }, nextRow, nextCol) && !board[nextRow][nextCol],
    };
  }

  function scoreLine(stones, openEnds) {
    if (stones >= 5) {
      return 100000;
    }

    if (stones === 4 && openEnds === 2) {
      return 25000;
    }

    if (stones === 4 && openEnds === 1) {
      return 10000;
    }

    if (stones === 3 && openEnds === 2) {
      return 3500;
    }

    if (stones === 3 && openEnds === 1) {
      return 800;
    }

    if (stones === 2 && openEnds === 2) {
      return 180;
    }

    if (stones === 2 && openEnds === 1) {
      return 50;
    }

    return openEnds === 2 ? 12 : 2;
  }

  function isStrongLine({ stones, openEnds }) {
    return (stones >= 4 && openEnds >= 1) || (stones === 3 && openEnds === 2);
  }

  function getCandidateCells(game, radius) {
    const openCells = getOpenCells(game);

    if (openCells.length === 0) {
      return [];
    }

    const occupiedCells = getOccupiedCells(game);

    if (occupiedCells.length === 0) {
      return openCells;
    }

    const candidates = openCells.filter(([row, col]) =>
      occupiedCells.some(([occupiedRow, occupiedCol]) => {
        const rowDistance = Math.abs(row - occupiedRow);
        const colDistance = Math.abs(col - occupiedCol);

        return Math.max(rowDistance, colDistance) <= radius;
      }),
    );

    return candidates.length ? candidates : openCells;
  }

  function getOccupiedCells(game) {
    const cells = [];

    for (let row = 0; row < game.size; row += 1) {
      for (let col = 0; col < game.size; col += 1) {
        if (game.board[row][col]) {
          cells.push([row, col]);
        }
      }
    }

    return cells;
  }

  function compareRankedMoves(game, moveA, moveB) {
    const center = (game.size - 1) / 2;
    const distanceA = (moveA.row - center) ** 2 + (moveA.col - center) ** 2;
    const distanceB = (moveB.row - center) ** 2 + (moveB.col - center) ** 2;

    return moveB.score - moveA.score || distanceA - distanceB || moveA.row - moveB.row || moveA.col - moveB.col;
  }

  function getOpenCells(game) {
    const cells = [];

    for (let row = 0; row < game.size; row += 1) {
      for (let col = 0; col < game.size; col += 1) {
        if (!game.board[row][col]) {
          cells.push([row, col]);
        }
      }
    }

    return cells;
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
    COMPUTER_DIFFICULTIES,
    createEmptyBoard,
    createGame,
    placeStone,
    undoMove,
    resetGame,
    countStones,
    chooseComputerMove,
    findImmediateMove,
    chooseNearbyMove,
    chooseScoredMove,
    getOpenCells,
    findWinningLine,
    isInsideBoard,
    nextPlayer,
  };
});
