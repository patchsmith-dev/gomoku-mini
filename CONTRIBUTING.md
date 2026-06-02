# Contributing

Thank you for considering a contribution to Gomoku Mini.

## Good First Contributions

- Improve README examples
- Add tests for board logic
- Fix layout issues on small screens
- Add translations
- Improve accessibility labels
- Add optional game modes

## Local Development

No install step is required for the game itself. Open `index.html` in a browser or run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

To run automated checks, use Node.js 22 or newer:

```bash
npm run check
```

## Pull Request Checklist

- Keep changes focused
- Update `README.md` when behavior changes
- Add or update tests if you introduce test tooling
- Include screenshots for visual changes
- Use clear commit messages
- Keep accessibility behavior in mind for board or control changes

## Code Style

- Prefer small functions with descriptive names
- Keep JavaScript dependency-free unless a new dependency has a strong reason
- Keep UI controls accessible through keyboard navigation
- Add tests in `test/engine.test.js` when changing Gomoku rules

## Issue Labels

- `good first issue`: approachable for new contributors
- `help wanted`: ready for community contribution
- `accessibility`: improves keyboard or assistive technology support
- `gameplay`: changes rules or player experience
- `documentation`: improves docs, examples, or maintainer notes
