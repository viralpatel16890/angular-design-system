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

## Relationship to the component library

This directory and `projects/angular-ds/src/lib/tokens/_primitives.scss` are two
independently maintained files that must describe the same primitive color values —
`tokens.json` exists for Figma/Tokens Studio round-tripping, while `_primitives.scss`
is what the library actually ships and renders. There is currently no automated check
that keeps their color values in sync (only `npm run tokens:check` guards `tokens.json`
against its own `build/` output). If you change a primitive color in one file, mirror it
in the other by hand, or add a script that diffs the two before this drifts again.

Note also that the semantic layer's naming diverges between the two files (e.g. this
file's `semantic.surface.base` maps to `neutral.50`, while the library's
`--color-surface-base` maps to `neutral-0`/white) — reconciling that mapping is a
design decision, not just a value fix, and should be confirmed with design before
either side is changed.
