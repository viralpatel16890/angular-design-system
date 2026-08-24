# Token Contrast Audit

This document records the WCAG 2.x contrast ratio of every semantic
text/foreground-on-background color token pair actually consumed by a
component in `projects/angular-ds/src/lib/components/**`, for both the light
theme (default `:root`) and the dark theme (`[data-theme="dark"]`).

It exists because a prior audit found that despite the README claiming
"WCAG 2.2 AA compliant", **no contrast ratio for any color token pair was
documented or verified anywhere in the repository.** This file is that
verification.

**Update:** the original pass of this audit (below, initial results) found
13 of 25 pairs failing AA and deliberately changed no token values, leaving
that as a human decision. A follow-up automated `@axe-core/playwright` scan
(`e2e/axe-a11y.spec.ts`, `npm run test:a11y`) independently surfaced the
same real violations in practice and fixed them at the token/component
level — see `git log` on `_semantic.scss`, `alert.component.scss`,
`badge.component.scss`, `balance-card.component.scss`,
`crypto-ticker.component.scss`, `metric-card.component.scss`,
`toast-container.component.scss`, `select.component.html`, and
`showcase/app.scss`. This file has been re-run and updated to reflect that
— see "Known gaps" below for what's still open.

- **Methodology**: standard WCAG relative-luminance + contrast-ratio formula
  (`(L1 + 0.05) / (L2 + 0.05)`, sRGB → linear-light per channel), computed by
  [`scripts/check-contrast.js`](../scripts/check-contrast.js). No third-party
  contrast-checking package was added; the ~40 lines of math are inlined in
  that script, along with a hand-transcribed map of primitive hex values and
  the semantic → primitive resolution for both themes (from
  `_primitives.scss` / `_semantic.scss` and, where a component sets its own
  dark-mode colors directly — badge, alert — from that component's `.scss`).
  Re-run it with `node scripts/check-contrast.js` (or `--markdown` to
  regenerate the table below) whenever a token value changes.
- **Thresholds**: AA = 4.5:1 for normal text, 3:1 for large text (≥18.66px
  bold / ≥24px regular) or non-text UI component indicators; AAA = 7:1 for
  normal text (no AAA criterion exists for large text/UI components, so
  AAA there would read "N/A" — none of the pairs below qualify as large
  text, so none are marked N/A). All 25 pairs here are normal-size text
  (button/badge labels included — none reach the "large text" bold/size
  threshold), so AA/AAA are evaluated at the 4.5:1 / 7:1 thresholds
  throughout.
- **Scope**: pairs are the token *names* (e.g. `--color-text-primary` on
  `--color-surface-base`), resolved to the hex values each theme actually
  produces. A token not overridden in `[data-theme="dark"]` (e.g.
  `--color-text-danger`, `--color-danger-default`) resolves to the *same*
  hex in both themes — the background it sits on may still change, so the
  ratio itself can still move between themes even when the token's own
  color doesn't.

## Known gaps

After the axe-core-driven fixes, **all 25 audited pairs now pass WCAG AA in
light mode** (previously 12/25; the 13 light-mode/both-mode failures were
resolved by shifting `--color-danger-default` a step darker, adding a
`--color-text-info` token, moving several components off raw
`*-default` fill colors onto the dedicated `--color-text-*` tokens, and
darkening a couple of accent shades — see the intro's update note for the
exact commits). **17 of 25 pass AA in both themes**, up from 12.

**8 pairs still fail AA in dark mode**, and every one traces to the same
root cause: **`[data-theme="dark"]` in `_semantic.scss` only overrides
`--color-text-{primary,secondary,tertiary,disabled}`,
`--color-surface-{base,subtle,muted,overlay}`,
`--color-border-{default,strong}`, and
`--color-brand-primary-{subtle,muted}`.** Every other brand/feedback token
keeps its **light-theme hex value** in dark mode, while `--color-surface-base`
gets much darker — so on `surface-base`: `text-tertiary` (4.18:1),
`text-brand` (2.51:1), `text-danger` (3.15:1), `text-success` (3.95:1),
`text-warning` (3.94:1), `text-link` (2.51:1); plus `brand-primary` on
`brand-primary-subtle` (1.82:1) and `interactive-default` on
`brand-primary-muted` (1.58:1) — that last one barely more than a rounding
error above "identical color". This is a single, well-scoped fix: add
dark-mode overrides for these tokens in `_semantic.scss`. **No token values
were changed to fix this in this pass** — deciding the actual dark-mode
color values is a design decision for a human, not something to silently
patch.

**A separate, non-contrast gap this audit surfaced along the way:**
`alert.component.scss` has no `[data-theme="dark"]` block at all — its
background token (`--color-info/success/warning/danger-subtle`) isn't
theme-overridden either, so in dark mode the alert keeps its **light**
background and renders as a light box on a dark page. Its *text-on-its-own-
background* contrast is fine (it never actually darkens), but that's a
theme-adaptivity bug, not a contrast one — the same fix approach as the 8
pairs above (an explicit `[data-theme="dark"]` block for `alert`) would
resolve both at once. `badge--info` has the identical issue (no dark-mode
override), unlike every other badge variant.

The one pair still tight in **both** themes: **`--color-on-danger` on
`--color-danger-default`** (white button label on the danger-red fill) is
4.70:1 in both — passes AA (4.5:1) but with little margin; worth revisiting
if the danger red changes again.

None of this is e2e/axe-covered in CI today (per the root README, a11y
checks currently run locally only, not in CI) — the fixes above came from
running `npm run test:a11y` locally, not from an automated gate.

## Results

| Token pair | Used by | Light hex (fg on bg) | Dark hex (fg on bg) | Ratio (light) | Ratio (dark) | AA 4.5:1 (light / dark) | AAA 7:1 (light / dark) |
|---|---|---|---|---|---|---|---|
| `--color-text-primary` / `--color-surface-base` | body text, card, modal, sidebar, input, select, navbar | `#171717` on `#ffffff` | `#fafafa` on `#0a0a0a` | 17.93:1 | 18.97:1 | Pass / Pass | Pass / Pass |
| `--color-text-secondary` / `--color-surface-base` | balance-card, tabs, toast, progress, checkbox helper text | `#525252` on `#ffffff` | `#a3a3a3` on `#0a0a0a` | 7.81:1 | 7.85:1 | Pass / Pass | Pass / Pass |
| `--color-text-tertiary` / `--color-surface-base` | crypto-ticker, sidebar, select placeholder, transaction-item meta | `#737373` on `#ffffff` | `#737373` on `#0a0a0a` | 4.74:1 | 4.18:1 | Pass / **Fail** | Fail / Fail |
| `--color-text-brand` / `--color-surface-base` | `button--ghost` label | `#4338ca` on `#ffffff` | `#4338ca` on `#0a0a0a` | 7.90:1 | 2.51:1 | Pass / **Fail** | Pass / Fail |
| `--color-text-danger` / `--color-surface-base` | input/select error hint, toast danger title | `#be123c` on `#ffffff` | `#be123c` on `#0a0a0a` | 6.29:1 | 3.15:1 | Pass / **Fail** | Fail / Fail |
| `--color-text-success` / `--color-surface-base` | input/select success hint, toast success title | `#15803d` on `#ffffff` | `#15803d` on `#0a0a0a` | 5.02:1 | 3.95:1 | Pass / **Fail** | Fail / Fail |
| `--color-text-warning` / `--color-surface-base` | input/select warning hint, toast warning title | `#b45309` on `#ffffff` | `#b45309` on `#0a0a0a` | 5.02:1 | 3.94:1 | Pass / **Fail** | Fail / Fail |
| `--color-text-link` / `--color-surface-base` | `button--link` label | `#4338ca` on `#ffffff` | `#4338ca` on `#0a0a0a` | 7.90:1 | 2.51:1 | Pass / **Fail** | Pass / Fail |
| `--color-text-primary` / `--color-surface-subtle` | accordion hover row, balance-card, metric-card, crypto-ticker bg | `#171717` on `#fafafa` | `#fafafa` on `#171717` | 17.18:1 | 17.18:1 | Pass / Pass | Pass / Pass |
| `--color-text-primary` / `--color-surface-muted` | `button--secondary` label, disabled input bg, sidebar hover row | `#171717` on `#f5f5f5` | `#fafafa` on `#262626` | 16.44:1 | 14.50:1 | Pass / Pass | Pass / Pass |
| `--color-text-inverse` / `--color-surface-inverse` | tooltip | `#ffffff` on `#171717` | `#ffffff` on `#171717` | 17.93:1 | 17.93:1 | Pass / Pass | Pass / Pass |
| `--color-on-interactive` / `--color-interactive-default` | `button--primary` label, tabs active label, checkbox check mark | `#ffffff` on `#4f46e5` | `#ffffff` on `#4f46e5` | 6.29:1 | 6.29:1 | Pass / Pass | Fail / Fail |
| `--color-on-danger` / `--color-danger-default` | `button--danger` label, navbar/sidebar notification dot | `#ffffff` on `#e11d48` | `#ffffff` on `#e11d48` | 4.70:1 | 4.70:1 | Pass / Pass | Fail / Fail |
| `--color-brand-primary` / `--color-brand-primary-subtle` | navbar active link, sidebar active item, select active option | `#4f46e5` on `#eef2ff` | `#4f46e5` on `#312e81` | 5.62:1 | 1.82:1 | Pass / **Fail** | Fail / Fail |
| `--color-interactive-default` / `--color-brand-primary-muted` | avatar initials | `#4f46e5` on `#e0e7ff` | `#4f46e5` on `#3730a3` | 5.10:1 | 1.58:1 | Pass / **Fail** | Fail / Fail |
| `badge--default` text/bg | badge (default variant) | `#404040` on `#f5f5f5` | `#d4d4d4` on `#262626` | 9.51:1 | 10.21:1 | Pass / Pass | Pass / Pass |
| `badge--primary` text/bg | badge (primary variant) | `#4338ca` on `#e0e7ff` | `#c4b5fd` on `#4c1d95` | 6.41:1 | 5.93:1 | Pass / Pass | Fail / Fail |
| `badge--success` text/bg | badge (success variant) | `#15803d` on `#dcfce7` | `#86efac` on `#14532d` | 4.57:1 | 6.49:1 | Pass / Pass | Fail / Fail |
| `badge--warning` text/bg | badge (warning variant) | `#b45309` on `#fef3c7` | `#fcd34d` on `#78350f` | 4.51:1 | 6.29:1 | Pass / Pass | Fail / Fail |
| `badge--danger` text/bg | badge (danger variant) | `#be123c` on `#ffe4e6` | `#fda4af` on `#881337` | 5.24:1 | 5.06:1 | Pass / Pass | Fail / Fail |
| `badge--info` text/bg | badge (info variant) — no dark override, see gap note | `#0e7490` on `#cffafe` | `#0e7490` on `#cffafe` | 4.79:1 | 4.79:1 | Pass / Pass | Fail / Fail |
| `alert` (info/default) fg/bg | alert default variant — no dark override, see gap note | `#0e7490` on `#ecfeff` | `#0e7490` on `#ecfeff` | 5.15:1 | 5.15:1 | Pass / Pass | Fail / Fail |
| `alert--success` fg/bg | alert success variant — no dark override, see gap note | `#15803d` on `#f0fdf4` | `#15803d` on `#f0fdf4` | 4.79:1 | 4.79:1 | Pass / Pass | Fail / Fail |
| `alert--warning` fg/bg | alert warning variant — no dark override, see gap note | `#b45309` on `#fffbeb` | `#b45309` on `#fffbeb` | 4.84:1 | 4.84:1 | Pass / Pass | Fail / Fail |
| `alert--danger` fg/bg | alert danger variant — no dark override, see gap note | `#be123c` on `#fff1f2` | `#be123c` on `#fff1f2` | 5.72:1 | 5.72:1 | Pass / Pass | Fail / Fail |

**Totals**: 25 pairs audited · AA: **25/25 pass in light mode** (up from
12/25), **17/25 pass in both themes** (up from 12/25), 8 fail in dark mode
only — all 8 trace to the single root cause in "Known gaps" above · AAA: 6
pass in both themes, 19 fail in at least one theme (AAA is a stretch goal,
not part of the AA claim below). Note that the `alert`/`badge--info` rows'
"dark" figures reflect those components' actual behavior of not adapting
to dark mode at all, not a genuine dark-theme-aware color choice — see the
gap note above.

## What this means for the README's compliance claim

The root `README.md` previously stated every component "ships WCAG 2.2 AA
compliant" without qualification. As of this audit, **light-mode contrast
is fully AA-compliant (25/25)**; dark mode still has 8 real gaps, all
concentrated in brand/feedback foreground tokens that were never given a
`[data-theme="dark"]` override (plus the separate `alert`/`badge--info`
theme-adaptivity issue noted above). The README has been updated to
reflect this (structure, ARIA, keyboard nav, and focus management are
unaffected by this audit and remain accurate); this file is the source of
truth for what does and doesn't currently pass, until the dark-mode gap is
resolved.
