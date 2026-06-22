# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

- Added a Chinese README section with project overview, feature summary, setup, and gameplay notes

## 0.4.2 - 2026-06-22

- Added a Resign action that ends the active game and awards the opponent a win

## 0.4.1 - 2026-06-20

- Changed move history, hint announcements, and cell descriptions to use board coordinates such as H8
- Added a computer opening style control with Center and Varied options
- Made move history entries clickable so players can refocus previous moves on the board
- Added a selected-coordinate readout below the board for touch and keyboard feedback
- Added a copy-current-position action for sharing the active board state

## 0.4.0 - 2026-06-07

- Added a Hint action that highlights and announces a suggested move
- Added computer side selection so the local computer can play Black or White
- Added automatic computer opening moves when the computer is set to Black
- Added selected-starting-player support in the game engine
- Added Classic, Forest, and Midnight visual theme selection with local preference saving
- Added visible row and column coordinates around the board
- Updated accessibility, localization, engine tests, README, and architecture notes

## 0.3.9 - 2026-06-06

- Added Hard and Extreme computer difficulty levels
- Added scored line selection for Hard difficulty
- Added stronger defensive weighting and response estimation for Extreme difficulty
- Updated difficulty tests, README, roadmap, and package metadata

## 0.3.8 - 2026-06-05

- Added reduced-motion preference support for stone placement transitions
- Added regression coverage for reduced-motion styling
- Updated roadmap and accessibility notes after completing reduced-motion support

## 0.3.7 - 2026-06-05

- Added CI-backed accessibility regression checks for visible focus styling
- Added source checks for the result live region and latest-move current-step markup
- Updated roadmap and accessibility docs after completing focus visibility coverage

## 0.3.6 - 2026-06-05

- Added a copy button for the recent match summary
- Announced copy success and failure through the existing live region
- Added regression coverage for localized recent-match copying

## 0.3.5 - 2026-06-05

- Added a visual and screen-reader-visible marker for the latest move
- Fixed the empty recent-match state so it follows the selected interface language
- Added regression coverage for recent-match localization

## 0.3.4 - 2026-06-04

- Added a saved language selector for English and Chinese
- Localized visible game controls, status text, move history, recent match summaries, and key ARIA labels
- Updated README, roadmap, and accessibility notes after adding bilingual interface support

## 0.3.3 - 2026-06-04

- Added selectable computer difficulty with Easy and Normal modes
- Added engine coverage for difficulty-specific computer move selection
- Updated roadmap and README after completing selectable difficulty

## 0.3.2 - 2026-06-04

- Added an optional elapsed game timer that starts on the first move and stops when the match ends
- Included timed match duration in the recent completed match summary
- Updated roadmap and accessibility notes after completing timer mode

## 0.3.1 - 2026-06-03

- Added a local high-contrast display toggle, including board-edge contrast
- Updated contributor suggestions after completed player-name and computer-mode work

## 0.3.0 - 2026-06-03

- Added optional custom player names for status, result, score, move history, and saved match summaries
- Added optional local computer mode with a tested heuristic move selector
- Added keyboard board navigation with Arrow keys, Home, End, Enter, and Space
- Added polite live region announcements for wins and draws
- Added a localStorage-backed recent completed match summary
- Updated accessibility documentation with current keyboard support

## 0.2.0 - 2026-06-02

- Added a testable game engine module
- Added Node.js tests for move validation, win detection, undo, and reset
- Added draw-state support
- Added GitHub Actions CI
- Added GitHub Pages deployment workflow
- Added security, support, architecture, accessibility, and release documentation

## 0.1.0 - 2026-06-02

- Added the first playable browser version
- Added 15 x 15 board rendering
- Added two-player turns, undo, reset, move history, and win detection
- Added open source documentation and GitHub templates
