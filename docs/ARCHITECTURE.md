# Architecture

Gomoku Mini is intentionally small and dependency-free. The project is split into two layers:

## Game Engine

`src/engine.js` contains board state, move validation, turn switching, win detection, undo, reset, resign, selected opening player support, and stone counting.

It also contains the small computer move selector used by local computer mode and the Hint control. The selector is intentionally deterministic and simple: it can apply an opening style on an empty board, then prefers an immediate winning move, blocks an immediate opponent win, and ranks nearby open cells according to the selected difficulty.

The engine is written as a tiny universal module:

- In the browser it attaches to `window.GomokuEngine`
- In Node.js tests it can be loaded with `require("../src/engine.js")`

This keeps the core rules testable without adding a bundler.

## Browser UI

`src/main.js` connects the engine to the DOM:

- Renders the 15 x 15 board
- Displays row and column coordinate labels around the board
- Handles clicks
- Handles player names and local computer mode
- Handles computer side selection and suggested move highlighting
- Handles computer opening style selection
- Handles move-history refocusing back to board cells
- Handles selected-coordinate feedback for touch and keyboard navigation
- Handles current-position copy summaries
- Handles resign actions and completed-match saving
- Handles local interface preferences such as language, contrast, and visual theme
- Updates move history and counts
- Shows win and draw state
- Enables undo and reset controls

## Styling

`src/styles.css` contains responsive layout and board styling. The board uses CSS Grid so every cell remains stable across viewport sizes.

## Why No Framework?

The project is meant to be easy for beginner contributors to inspect, run, and modify. Avoiding a framework keeps setup short and makes game logic easier to learn from.
