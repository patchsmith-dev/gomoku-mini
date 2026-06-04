# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

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
