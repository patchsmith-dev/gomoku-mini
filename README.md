# Gomoku Mini

Gomoku Mini is a lightweight, zero-dependency Gomoku game that runs directly in the browser. It is designed as a beginner-friendly open source project: small enough to understand in one sitting, but complete enough to be useful for learning, demos, and community contributions.

## Features

- 15 x 15 classic Gomoku board
- Local two-player mode
- Black and white turn tracking
- Five-in-a-row win detection
- Undo and reset controls
- Move history panel
- Keyboard and screen-reader friendly board cells
- No build step and no runtime dependencies

## Demo

Open `index.html` in any modern browser.

## Project Structure

```text
gomoku-mini/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── pull_request_template.md
├── docs/
│   └── ROADMAP.md
├── src/
│   ├── main.js
│   └── styles.css
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── index.html
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/gomoku-mini.git
cd gomoku-mini
```

Run the game:

```bash
# Option 1: open directly
open index.html

# Option 2: use a tiny local server
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## How To Play

Black moves first. Players take turns placing stones on empty intersections. The first player to connect five or more stones horizontally, vertically, or diagonally wins.

## Development

This project intentionally uses plain HTML, CSS, and JavaScript.

Useful areas for contributors:

- Improve mobile layout and touch behavior
- Add player names
- Add optional timer mode
- Add simple computer opponent
- Add tests for the win-checking logic
- Add translations

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
