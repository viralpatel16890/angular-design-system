# Design Tokens

This directory contains the single source-of-truth token definitions for the Angular Design System.

## Structure

- `tokens.json` — W3C Design Token Community Group format (used by Tokens Studio for Figma)
- `build/` — Generated output files (DO NOT edit manually)

## Build

```bash
npm run tokens:build
```

This generates:
- `build/tokens.css` — CSS custom properties (`:root` selector)
- `build/_tokens.scss` — SCSS variables
- `build/tokens.js` — ES6 JavaScript constants
- `build/tokens.d.ts` — TypeScript declarations

## CI Check

Run `npm run tokens:check` to verify that generated output is in sync with `tokens.json`. The CI pipeline fails if there is any drift.

## Figma Integration

1. Install [Tokens Studio](https://tokens.studio/) plugin in Figma
2. Connect the plugin to this repository's `design-tokens/tokens.json`
3. On token changes, sync to this file and run `npm run tokens:build`
