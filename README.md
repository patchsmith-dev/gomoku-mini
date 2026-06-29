# Gomoku Mini

[![CI](https://github.com/patchsmith-dev/gomoku-mini/actions/workflows/ci.yml/badge.svg)](https://github.com/patchsmith-dev/gomoku-mini/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/patchsmith-dev/gomoku-mini/actions/workflows/pages.yml/badge.svg)](https://github.com/patchsmith-dev/gomoku-mini/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Gomoku Mini is a lightweight, zero-dependency Gomoku game that runs directly in the browser. It is designed as a beginner-friendly open source project: small enough to understand in one sitting, but complete enough to be useful for learning, demos, and community contributions.

## 中文说明

Gomoku Mini 是一个轻量级、零运行依赖的浏览器五子棋小游戏。项目使用原生 HTML、CSS 和 JavaScript 编写，不需要构建步骤，适合用来学习前端基础、棋类规则实现、无障碍交互和开源项目结构。

主要功能：

- 15 x 15 标准五子棋棋盘
- 本地双人对战
- 本地电脑对手模式
- Easy、Normal、Hard、Extreme 四档电脑难度
- 可选择电脑执黑或执白
- Center / Varied 电脑开局风格
- 中英文界面切换
- Classic、Forest、Midnight 三种视觉主题
- 棋盘坐标、当前选中坐标、最后一手标记、可选棋子手数显示
- 走子记录可点击回看
- 提示、悔棋、认输、重置、计时器
- 复制当前局面、棋盘文本图、走子记录和最近对局摘要
- 键盘导航、屏幕阅读器播报、高对比度和减少动画支持

在线试玩：

```text
https://patchsmith-dev.github.io/gomoku-mini/
```

本地运行：

```bash
python -m http.server 8000
```

然后打开 `http://localhost:8000`。

基本玩法：黑方先手，双方轮流在空位落子。任意一方率先在横向、纵向或斜向连成五子或更多即获胜。棋盘外侧显示 A-O 和 1-15 坐标，走子记录和提示会使用 `H8` 这类坐标格式；开启手数显示后，棋子上会直接显示第几手，方便复盘和分享。

## Features

- 15 x 15 classic Gomoku board
- Local two-player mode
- Optional local computer opponent mode
- Four selectable computer difficulty levels
- Selectable computer side for Black or White
- Center or Varied computer opening style
- Suggested move hints with board highlighting
- English and Chinese interface option
- Classic, Forest, and Midnight visual themes
- Custom player names
- Black and white turn tracking
- Last-move marker
- Optional move numbers on stones for reviewing games
- Visible board coordinates for rows and columns
- Selected-coordinate readout for touch and keyboard feedback
- Five-in-a-row win detection
- Undo and reset controls
- Resign control for ending a game early
- Move history panel
- Clickable move history for refocusing previous stones
- Coordinate-based move history and hints
- Copyable board text diagram
- Copyable move list for review and sharing
- Copyable current position summary
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

Use the row and column coordinates around the board to reference moves quickly. Columns are labeled A through O, and rows are labeled 1 through 15. Move history and hints use the same coordinate format, such as H8.

Click any move in the move history to focus that stone on the board.

Use Copy Moves to copy the current move sequence as a numbered coordinate list.

Use Copy Board to copy the current position as a coordinate text diagram with `X` for Black, `O` for White, and `.` for empty points.

Turn on Move numbers to show each stone's move order directly on the board for reviews, screenshots, and shared position discussions.

Use the selected-coordinate readout below the board to confirm the current focused cell while tapping or navigating with the keyboard.

Use Copy Position to copy the active result, turn, selected coordinate, and move sequence for sharing or debugging.

Use Resign to end the current game early and award the win to the opponent.

Use the mode control to switch between local two-player play and a simple local computer opponent. In computer mode, the computer can play Black or White. If the computer plays Black, it opens the match automatically. Choose Center opening for the classic middle-point start, or Varied opening to rotate through nearby opening points across resets. Easy chooses a nearby open cell, Normal wins or blocks immediate threats, Hard scores line extensions and pressure, and Extreme adds stronger defense with a one-step response estimate.

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

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

Good first issue ideas are tracked in the issue queue.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
