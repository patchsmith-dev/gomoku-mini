# Gomoku Mini

[![CI](https://github.com/patchsmith-dev/gomoku-mini/actions/workflows/ci.yml/badge.svg)](https://github.com/patchsmith-dev/gomoku-mini/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/patchsmith-dev/gomoku-mini/actions/workflows/pages.yml/badge.svg)](https://github.com/patchsmith-dev/gomoku-mini/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Gomoku Mini is a lightweight, zero-dependency Gomoku game that runs directly in the browser. It is designed as a beginner-friendly open source project: small enough to understand in one sitting, but complete enough to be useful for learning, demos, and community contributions.

## Features

- 15 x 15 classic Gomoku board
- Local two-player mode
- Optional local computer opponent mode
- Four selectable computer difficulty levels
- Selectable computer side for Black or White
- Suggested move hints with board highlighting
- English and Chinese interface option
- Classic, Forest, and Midnight visual themes
- Custom player names
- Black and white turn tracking
- Last-move marker
- Visible board coordinates for rows and columns
- Five-in-a-row win detection
- Undo and reset controls
- Move history panel
- Recent completed match summary
- Copyable recent match summary
- Optional elapsed game timer
- Draw detection
- Tested game engine
- Keyboard board navigation
- Screen-reader result announcements
- Optional high-contrast display mode
- Reduced-motion preference support
- No build step and no runtime dependencies

## Demo

Try the GitHub Pages demo:

```text
https://patchsmith-dev.github.io/gomoku-mini/
```

You can also open `index.html` locally or serve the directory with a tiny static server.

## Project Structure

```text
gomoku-mini/
|-- .github/
|   |-- ISSUE_TEMPLATE/
|   |-- workflows/
|   |-- CODEOWNERS
|   `-- pull_request_template.md
|-- docs/
|   |-- ACCESSIBILITY.md
|   |-- ARCHITECTURE.md
|   |-- RELEASE_CHECKLIST.md
|   `-- ROADMAP.md
|-- src/
|   |-- engine.js
|   |-- main.js
|   `-- styles.css
|-- test/
|   |-- accessibility.test.js
|   |-- engine.test.js
|   `-- localization.test.js
|-- CHANGELOG.md
|-- CONTRIBUTING.md
|-- LICENSE
|-- package.json
`-- index.html
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/patchsmith-dev/gomoku-mini.git
cd gomoku-mini
```

Run the game:

```bash
# Use a tiny local server
python -m http.server 8000
```

Then visit `http://localhost:8000`.

Run checks:

```bash
npm run check
```

## How To Play

Black moves first. Players take turns placing stones on empty intersections. The first player to connect five or more stones horizontally, vertically, or diagonally wins.

Use the row and column coordinates around the board to reference moves quickly. Columns are labeled A through O, and rows are labeled 1 through 15.

Use the mode control to switch between local two-player play and a simple local computer opponent. In computer mode, the computer can play Black or White. If the computer plays Black, it opens the match automatically. Easy chooses a nearby open cell, Normal wins or blocks immediate threats, Hard scores line extensions and pressure, and Extreme adds stronger defense with a one-step response estimate.

Use the Hint control to highlight a suggested move for the current player. Hints use the selected difficulty level and are announced through the status region for screen-reader users.

Use the timer control to track elapsed match time. The timer starts on the first move, stops when the match ends, and resets with the board.

Use the language control to switch the interface between English and Chinese. The preference is saved locally in the browser.

Use the theme control to switch between Classic, Forest, and Midnight board styles. The preference is saved locally in the browser.

Keyboard controls:

- Arrow keys move focus across the board
- Home and End move to the first and last cell in the focused row
- Enter or Space places a stone on the focused empty cell

## Development

This project intentionally uses plain HTML, CSS, and JavaScript.

The rule engine lives in `src/engine.js` and is covered by Node.js tests in `test/engine.test.js`.
Browser-facing localization, focus visibility, and UI affordances are covered by focused source regression tests.

Useful areas for contributors:

- Improve mobile layout and touch behavior
- Add opening variety for the computer opponent

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

Good first issue ideas are tracked in the issue queue.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
