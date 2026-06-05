# Accessibility Notes

Accessibility is part of the project roadmap, not an afterthought.

## Current Support

- Board cells are buttons, so they can receive focus
- Cells expose row and column labels
- The board uses ARIA grid metadata
- Status text updates after each move
- Controls are reachable with keyboard navigation
- Arrow keys move focus across board cells
- Home and End move to the first and last cell in the focused row
- Enter and Space place a stone on the focused empty cell
- Wins and draws are announced through a polite live region
- A local high-contrast display toggle is available in the setup panel
- A local elapsed timer is available without live announcements, so screen readers are not interrupted every second
- English and Chinese interface labels update visible text and key ARIA labels together
- The latest played stone is marked visually and exposed with `aria-current="step"`
- Copying the recent-match summary reports success or failure through the polite live region
- Stone placement transitions are disabled when the user prefers reduced motion

## Planned Improvements

- Keep accessibility checks aligned with new controls and visual states

## Contribution Ideas

Accessibility issues are good first contributions when they include a clear before/after behavior and a manual test plan.
