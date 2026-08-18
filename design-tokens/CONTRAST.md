# Token Contrast Audit

This document records the WCAG 2.x contrast ratio of every semantic
text/foreground-on-background color token pair actually consumed by a
component in `projects/angular-ds/src/lib/components/**`, for both the light
theme (default `:root`) and the dark theme (`[data-theme="dark"]`).

It exists because a prior audit found that despite the README claiming
"WCAG 2.2 AA compliant", **no contrast ratio for any color token pair was
documented or verified anywhere in the repository.** This file is that
verification. No token color values were changed to produce it — see
"Known gaps" below for the pairs that do not currently meet AA and need a
human decision (adjust the token, adjust the component, or accept and
document the exception).

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

13 of the 25 audited pairs fail WCAG AA in at least one theme. **No token
values were changed to fix these** — that's a design decision for a human,
not something to silently patch. Grouped by root cause:

1. **Dark theme does not adjust brand/feedback foreground colors, only
   text/surface neutrals.** `[data-theme="dark"]` in `_semantic.scss` only
   overrides `--color-text-{primary,secondary,tertiary,disabled}`,
   `--color-surface-{base,subtle,muted,overlay}`,
   `--color-border-{default,strong}`, and
   `--color-brand-primary-{subtle,muted}`. Tokens like `--color-text-brand`,
   `--color-text-danger/success/warning`, `--color-danger/success/warning/
   info-default`, and `--color-brand-primary` keep their **light-theme hex
   value** in dark mode, while the surface they sit on gets much darker.
   Result: `text-brand`, `text-danger`, `text-success`, `text-warning`,
   `text-link` on `surface-base`, plus `brand-primary` on
   `brand-primary-subtle` and `interactive-default` on
   `brand-primary-muted`, all pass comfortably in light mode and **fail AA
   in dark mode** (some as low as 1.58:1 — barely more than a rounding
   error above "identical color").
2. **`--color-text-tertiary` on `--color-surface-base` fails AA in both
   themes** (2.52:1 light, 4.18:1 dark) — it was likely designed against a
   3:1 "large text/muted" assumption but is used for normal-size body text
   (crypto-ticker meta, sidebar labels, select placeholder, transaction-item
   meta), where 4.5:1 applies.
3. **`--color-on-danger` on `--color-danger-default`** (white button label
   on the danger-red fill) is only 3.67:1 in **both** themes — the danger
   button's own primitive (`--color-red-500`) is too light for white text at
   normal size, independent of theme.
4. **The `alert` component has no dark-mode adjustment at all** (no
   `[data-theme="dark"]` block in `alert.component.scss`, and none of the
   tokens it uses are theme-overridden). Its default/info variant
   (2.33:1) and danger variant (4.28:1) fail AA in **both** themes — these
   are pre-existing light-mode failures, not dark-mode regressions.
5. **`badge--info` has no dark-mode adjustment** (unlike every other badge
   variant, which sets distinct dark colors) and is a light-mode failure
   too — 2.17:1 in both themes, the lowest ratio in this audit.
6. **`badge--danger` fails AA in light mode only** (3.91:1) — its dark
   variant (explicit `--color-red-300` on `--color-red-900`) actually
   passes at 5.06:1.

None of items 1–6 are e2e/axe-covered today (per the root README, a11y
checks currently run locally only, not in CI), which is consistent with
these having gone unnoticed.

## Results

| Token pair | Used by | Light hex (fg on bg) | Dark hex (fg on bg) | Ratio (light) | Ratio (dark) | AA 4.5:1 (light / dark) | AAA 7:1 (light / dark) |
|---|---|---|---|---|---|---|---|
| `--color-text-primary` / `--color-surface-base` | body text, card, modal, sidebar, input, select, navbar | `#171717` on `#ffffff` | `#fafafa` on `#0a0a0a` | 17.93:1 | 18.97:1 | Pass / Pass | Pass / Pass |
| `--color-text-secondary` / `--color-surface-base` | balance-card, tabs, toast, progress, checkbox helper text | `#525252` on `#ffffff` | `#a3a3a3` on `#0a0a0a` | 7.81:1 | 7.85:1 | Pass / Pass | Pass / Pass |
| `--color-text-tertiary` / `--color-surface-base` | crypto-ticker, sidebar, select placeholder, transaction-item meta | `#a3a3a3` on `#ffffff` | `#737373` on `#0a0a0a` | 2.52:1 | 4.18:1 | **Fail** / **Fail** | Fail / Fail |
| `--color-text-brand` / `--color-surface-base` | `button--ghost` label | `#4338ca` on `#ffffff` | `#4338ca` on `#0a0a0a` | 7.90:1 | 2.51:1 | Pass / **Fail** | Pass / Fail |
| `--color-text-danger` / `--color-surface-base` | input/select error hint, toast danger title | `#e11d48` on `#ffffff` | `#e11d48` on `#0a0a0a` | 4.70:1 | 4.21:1 | Pass / **Fail** | Fail / Fail |
| `--color-text-success` / `--color-surface-base` | input/select success hint, toast success title | `#15803d` on `#ffffff` | `#15803d` on `#0a0a0a` | 5.02:1 | 3.95:1 | Pass / **Fail** | Fail / Fail |
| `--color-text-warning` / `--color-surface-base` | input/select warning hint, toast warning title | `#b45309` on `#ffffff` | `#b45309` on `#0a0a0a` | 5.02:1 | 3.94:1 | Pass / **Fail** | Fail / Fail |
| `--color-text-link` / `--color-surface-base` | `button--link` label | `#4338ca` on `#ffffff` | `#4338ca` on `#0a0a0a` | 7.90:1 | 2.51:1 | Pass / **Fail** | Pass / Fail |
| `--color-text-primary` / `--color-surface-subtle` | accordion hover row, balance-card, metric-card, crypto-ticker bg | `#171717` on `#fafafa` | `#fafafa` on `#171717` | 17.18:1 | 17.18:1 | Pass / Pass | Pass / Pass |
| `--color-text-primary` / `--color-surface-muted` | `button--secondary` label, disabled input bg, sidebar hover row | `#171717` on `#f5f5f5` | `#fafafa` on `#262626` | 16.44:1 | 14.50:1 | Pass / Pass | Pass / Pass |
| `--color-text-inverse` / `--color-surface-inverse` | tooltip | `#ffffff` on `#171717` | `#ffffff` on `#171717` | 17.93:1 | 17.93:1 | Pass / Pass | Pass / Pass |
| `--color-on-interactive` / `--color-interactive-default` | `button--primary` label, tabs active label, checkbox check mark | `#ffffff` on `#4f46e5` | `#ffffff` on `#4f46e5` | 6.29:1 | 6.29:1 | Pass / Pass | Fail / Fail |
| `--color-on-danger` / `--color-danger-default` | `button--danger` label, navbar/sidebar notification dot | `#ffffff` on `#f43f5e` | `#ffffff` on `#f43f5e` | 3.67:1 | 3.67:1 | **Fail** / **Fail** | Fail / Fail |
| `--color-brand-primary` / `--color-brand-primary-subtle` | navbar active link, sidebar active item, select active option | `#4f46e5` on `#eef2ff` | `#4f46e5` on `#312e81` | 5.62:1 | 1.82:1 | Pass / **Fail** | Fail / Fail |
| `--color-interactive-default` / `--color-brand-primary-muted` | avatar initials | `#4f46e5` on `#e0e7ff` | `#4f46e5` on `#3730a3` | 5.10:1 | 1.58:1 | Pass / **Fail** | Fail / Fail |
| `badge--default` text/bg | badge (default variant) | `#404040` on `#f5f5f5` | `#d4d4d4` on `#262626` | 9.51:1 | 10.21:1 | Pass / Pass | Pass / Pass |
| `badge--primary` text/bg | badge (primary variant) | `#4338ca` on `#e0e7ff` | `#c4b5fd` on `#4c1d95` | 6.41:1 | 5.93:1 | Pass / Pass | Fail / Fail |
| `badge--success` text/bg | badge (success variant) | `#15803d` on `#dcfce7` | `#86efac` on `#14532d` | 4.57:1 | 6.49:1 | Pass / Pass | Fail / Fail |
| `badge--warning` text/bg | badge (warning variant) | `#b45309` on `#fef3c7` | `#fcd34d` on `#78350f` | 4.51:1 | 6.29:1 | Pass / Pass | Fail / Fail |
| `badge--danger` text/bg | badge (danger variant) | `#e11d48` on `#ffe4e6` | `#fda4af` on `#881337` | 3.91:1 | 5.06:1 | **Fail** / Pass | Fail / Fail |
| `badge--info` text/bg | badge (info variant) — no dark override | `#06b6d4` on `#cffafe` | `#06b6d4` on `#cffafe` | 2.17:1 | 2.17:1 | **Fail** / **Fail** | Fail / Fail |
| `alert` (info/default) fg/bg | alert default variant — no dark override | `#06b6d4` on `#ecfeff` | `#06b6d4` on `#ecfeff` | 2.33:1 | 2.33:1 | **Fail** / **Fail** | Fail / Fail |
| `alert--success` fg/bg | alert success variant — no dark override | `#15803d` on `#f0fdf4` | `#15803d` on `#f0fdf4` | 4.79:1 | 4.79:1 | Pass / Pass | Fail / Fail |
| `alert--warning` fg/bg | alert warning variant — no dark override | `#b45309` on `#fffbeb` | `#b45309` on `#fffbeb` | 4.84:1 | 4.84:1 | Pass / Pass | Fail / Fail |
| `alert--danger` fg/bg | alert danger variant — no dark override | `#e11d48` on `#fff1f2` | `#e11d48` on `#fff1f2` | 4.28:1 | 4.28:1 | **Fail** / **Fail** | Fail / Fail |

**Totals**: 25 pairs audited · AA: 12 pass in both themes, 13 fail in at
least one theme (7 of those are light-mode passes that regress in dark
mode; 6 fail in light mode already) · AAA: 6 pass in both themes, 19 fail
in at least one theme (AAA is a stretch goal, not part of the AA claim
below).

## What this means for the README's compliance claim

The root `README.md` previously stated every component "ships WCAG 2.2 AA
compliant" without qualification. That claim is not accurate as of this
audit — 13 of 25 real token pairs fail the AA contrast requirement in at
least one theme, concentrated in dark-mode brand/feedback text and in the
`alert` and `badge--info` components. The README has been updated to
qualify the claim accordingly (structure, ARIA, keyboard nav, and focus
management are unaffected by this audit and remain accurate); this file is
the source of truth for what does and doesn't currently pass, until the
failing pairs are resolved.
