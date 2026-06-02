# Accessibility Notes

Accessibility is part of the project roadmap, not an afterthought.

## Current Support

- Board cells are buttons, so they can receive focus
- Cells expose row and column labels
- The board uses ARIA grid metadata
- Status text updates after each move
- Controls are reachable with keyboard navigation

## Planned Improvements

- Add keyboard arrow navigation across board cells
- Announce winner and draw state through a live region
- Add high-contrast theme checks
- Add visible focus testing to the CI checklist
- Add reduced-motion preferences if animations are introduced

## Contribution Ideas

Accessibility issues are good first contributions when they include a clear before/after behavior and a manual test plan.
