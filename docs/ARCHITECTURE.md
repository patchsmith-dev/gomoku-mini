# Architecture

Gomoku Mini is intentionally small and dependency-free. The project is split into two layers:

## Game Engine

`src/engine.js` contains board state, move validation, turn switching, win detection, undo, reset, and stone counting.

The engine is written as a tiny universal module:

- In the browser it attaches to `window.GomokuEngine`
- In Node.js tests it can be loaded with `require("../src/engine.js")`

This keeps the core rules testable without adding a bundler.

## Browser UI

`src/main.js` connects the engine to the DOM:

- Renders the 15 x 15 board
- Handles clicks
- Updates move history and counts
- Shows win and draw state
- Enables undo and reset controls

## Styling

`src/styles.css` contains responsive layout and board styling. The board uses CSS Grid so every cell remains stable across viewport sizes.

## Why No Framework?

The project is meant to be easy for beginner contributors to inspect, run, and modify. Avoiding a framework keeps setup short and makes game logic easier to learn from.
