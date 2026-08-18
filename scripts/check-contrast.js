#!/usr/bin/env node
/**
 * check-contrast.js
 *
 * Computes WCAG 2.x relative-luminance contrast ratios for the semantic
 * text-on-background token pairs actually consumed by components in
 * projects/angular-ds/src/lib/components/**, for both the light (default)
 * and dark (`[data-theme="dark"]`) themes.
 *
 * This is throwaway/reusable tooling for documentation purposes only — it
 * does NOT read _primitives.scss / _semantic.scss at runtime (Sass custom
 * properties can't be resolved outside a browser/Sass compiler without extra
 * tooling). Instead the primitive hex values and the semantic -> primitive
 * mapping below are transcribed by hand from:
 *   - projects/angular-ds/src/lib/tokens/_primitives.scss
 *   - projects/angular-ds/src/lib/tokens/_semantic.scss
 *   - the individual component .scss files (for component-level pairs like
 *     badge/alert variants, which set their own dark-mode values rather than
 *     tokens overridden in [data-theme="dark"] of _semantic.scss)
 *
 * If the token values change, update the maps below to match, or re-derive
 * them from the source files. Run: `node scripts/check-contrast.js`
 * Optionally: `node scripts/check-contrast.js --markdown` to print a table.
 */

'use strict';

// ─── WCAG relative luminance + contrast ratio ────────────────────────────

/** Convert a hex color string (#rrggbb) to [r, g, b] in 0-255. */
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [r, g, b];
}

/** sRGB channel (0-255) -> linear-light value, per WCAG 2.x. */
function channelToLinear(c) {
  const cs = c / 255;
  return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
}

/** Relative luminance of a hex color, per WCAG 2.x (0 = black, 1 = white). */
function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(channelToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colors, always >= 1. */
function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function fmtRatio(ratio) {
  return `${ratio.toFixed(2)}:1`;
}

function aaPass(ratio, isLargeOrUi) {
  return ratio >= (isLargeOrUi ? 3 : 4.5);
}

function aaaPass(ratio, isLargeOrUi) {
  // WCAG defines no separate AAA threshold for large text/UI components in
  // 2.2; conventionally 4.5:1 is used for "large text" AAA. UI components
  // have no AAA success criterion at all, so we mark those "N/A".
  return ratio >= (isLargeOrUi ? 4.5 : 7);
}

// ─── Primitive palette (from _primitives.scss) ───────────────────────────

const primitives = {
  'indigo-50': '#eef2ff', 'indigo-100': '#e0e7ff', 'indigo-200': '#c7d2fe',
  'indigo-300': '#a5b4fc', 'indigo-400': '#818cf8', 'indigo-500': '#6366f1',
  'indigo-600': '#4f46e5', 'indigo-700': '#4338ca', 'indigo-800': '#3730a3',
  'indigo-900': '#312e81',
  'violet-300': '#c4b5fd', 'violet-900': '#4c1d95',
  'cyan-50': '#ecfeff', 'cyan-100': '#cffafe', 'cyan-500': '#06b6d4',
  'red-50': '#fff1f2', 'red-100': '#ffe4e6', 'red-300': '#fda4af',
  'red-500': '#f43f5e', 'red-600': '#e11d48', 'red-900': '#881337',
  'amber-50': '#fffbeb', 'amber-100': '#fef3c7', 'amber-300': '#fcd34d',
  'amber-500': '#f59e0b', 'amber-700': '#b45309', 'amber-900': '#78350f',
  'green-50': '#f0fdf4', 'green-100': '#dcfce7', 'green-300': '#86efac',
  'green-500': '#22c55e', 'green-700': '#15803d', 'green-900': '#14532d',
  'neutral-0': '#ffffff', 'neutral-50': '#fafafa', 'neutral-100': '#f5f5f5',
  'neutral-200': '#e5e5e5', 'neutral-300': '#d4d4d4', 'neutral-400': '#a3a3a3',
  'neutral-500': '#737373', 'neutral-600': '#525252', 'neutral-700': '#404040',
  'neutral-800': '#262626', 'neutral-900': '#171717', 'neutral-950': '#0a0a0a',
};

// ─── Semantic tokens resolved to hex, light and dark ─────────────────────
// (from _semantic.scss `:root` and its `[data-theme="dark"]` override block)

const p = (name) => primitives[name];

const semanticLight = {
  'color-brand-primary': p('indigo-600'),
  'color-brand-primary-subtle': p('indigo-50'),
  'color-brand-primary-muted': p('indigo-100'),
  'color-interactive-default': p('indigo-600'),
  'color-on-interactive': p('neutral-0'),
  'color-danger-default': p('red-500'),
  'color-danger-subtle': p('red-50'),
  'color-danger-muted': p('red-100'),
  'color-on-danger': p('neutral-0'),
  'color-success-subtle': p('green-50'),
  'color-success-muted': p('green-100'),
  'color-warning-subtle': p('amber-50'),
  'color-warning-muted': p('amber-100'),
  'color-info-default': p('cyan-500'),
  'color-info-subtle': p('cyan-50'),
  'color-info-muted': p('cyan-100'),
  'color-text-primary': p('neutral-900'),
  'color-text-secondary': p('neutral-600'),
  'color-text-tertiary': p('neutral-400'),
  'color-text-inverse': p('neutral-0'),
  'color-text-brand': p('indigo-700'),
  'color-text-danger': p('red-600'),
  'color-text-success': p('green-700'),
  'color-text-warning': p('amber-700'),
  'color-text-link': p('indigo-700'),
  'color-surface-base': p('neutral-0'),
  'color-surface-subtle': p('neutral-50'),
  'color-surface-muted': p('neutral-100'),
  'color-surface-inverse': p('neutral-900'),
};

// Start from light, then apply only the tokens [data-theme="dark"] overrides.
const semanticDark = {
  ...semanticLight,
  'color-text-primary': p('neutral-50'),
  'color-text-secondary': p('neutral-400'),
  'color-text-tertiary': p('neutral-500'),
  'color-surface-base': p('neutral-950'),
  'color-surface-subtle': p('neutral-900'),
  'color-surface-muted': p('neutral-800'),
  'color-brand-primary-subtle': p('indigo-900'),
  'color-brand-primary-muted': p('indigo-800'),
  // NOTE: color-surface-inverse, color-text-brand/danger/success/warning/link,
  // color-*-default/subtle/muted, color-on-* are NOT overridden in
  // [data-theme="dark"] — they resolve to the same hex in both themes.
};

// ─── Token pairs actually used by components (fg on bg) ──────────────────
// `light`/`dark` give hex pairs as [fg, bg]. Component pairs whose colors
// are set directly in the component .scss (badge/alert dark-mode variants)
// are transcribed from those files, not from the semantic dark overrides.

const pairs = [
  // Text on primary surface (surface-base is the default page/card background)
  { name: 'text-primary / surface-base', usedBy: 'body text, card, modal, sidebar, input, select, navbar', kind: 'normal',
    light: [semanticLight['color-text-primary'], semanticLight['color-surface-base']],
    dark:  [semanticDark['color-text-primary'], semanticDark['color-surface-base']] },
  { name: 'text-secondary / surface-base', usedBy: 'balance-card, tabs, toast, progress, checkbox helper text', kind: 'normal',
    light: [semanticLight['color-text-secondary'], semanticLight['color-surface-base']],
    dark:  [semanticDark['color-text-secondary'], semanticDark['color-surface-base']] },
  { name: 'text-tertiary / surface-base', usedBy: 'crypto-ticker, sidebar, select placeholder, transaction-item meta', kind: 'normal',
    light: [semanticLight['color-text-tertiary'], semanticLight['color-surface-base']],
    dark:  [semanticDark['color-text-tertiary'], semanticDark['color-surface-base']] },
  { name: 'text-brand / surface-base', usedBy: 'button--ghost text', kind: 'normal',
    light: [semanticLight['color-text-brand'], semanticLight['color-surface-base']],
    dark:  [semanticDark['color-text-brand'], semanticDark['color-surface-base']] },
  { name: 'text-danger / surface-base', usedBy: 'input/select error hint, toast danger title', kind: 'normal',
    light: [semanticLight['color-text-danger'], semanticLight['color-surface-base']],
    dark:  [semanticDark['color-text-danger'], semanticDark['color-surface-base']] },
  { name: 'text-success / surface-base', usedBy: 'input/select success hint, toast success title', kind: 'normal',
    light: [semanticLight['color-text-success'], semanticLight['color-surface-base']],
    dark:  [semanticDark['color-text-success'], semanticDark['color-surface-base']] },
  { name: 'text-warning / surface-base', usedBy: 'input/select warning hint, toast warning title', kind: 'normal',
    light: [semanticLight['color-text-warning'], semanticLight['color-surface-base']],
    dark:  [semanticDark['color-text-warning'], semanticDark['color-surface-base']] },
  { name: 'text-link / surface-base', usedBy: 'button--link text', kind: 'normal',
    light: [semanticLight['color-text-link'], semanticLight['color-surface-base']],
    dark:  [semanticDark['color-text-link'], semanticDark['color-surface-base']] },

  // Text on secondary surfaces
  { name: 'text-primary / surface-subtle', usedBy: 'accordion hover row, balance-card, metric-card, crypto-ticker bg', kind: 'normal',
    light: [semanticLight['color-text-primary'], semanticLight['color-surface-subtle']],
    dark:  [semanticDark['color-text-primary'], semanticDark['color-surface-subtle']] },
  { name: 'text-primary / surface-muted', usedBy: 'button--secondary text, disabled input bg, sidebar hover row', kind: 'normal',
    light: [semanticLight['color-text-primary'], semanticLight['color-surface-muted']],
    dark:  [semanticDark['color-text-primary'], semanticDark['color-surface-muted']] },

  // Inverse surface (tooltip) — color-surface-inverse is not theme-overridden
  { name: 'text-inverse / surface-inverse', usedBy: 'tooltip', kind: 'normal',
    light: [semanticLight['color-text-inverse'], semanticLight['color-surface-inverse']],
    dark:  [semanticDark['color-text-inverse'], semanticDark['color-surface-inverse']] },

  // Button / interactive fills (on-interactive, on-danger not theme-overridden).
  // Evaluated as normal text: the button label (font-size-md/16px semibold)
  // does not meet the "large text" bold-18.66px threshold, even though these
  // tokens are also reused for small non-text UI marks (checkbox check,
  // notification dot) where the lower 3:1 non-text threshold (WCAG 1.4.11)
  // would technically apply.
  { name: 'on-interactive / interactive-default', usedBy: 'button--primary label, tabs active label, checkbox check mark', kind: 'normal',
    light: [semanticLight['color-on-interactive'], semanticLight['color-interactive-default']],
    dark:  [semanticDark['color-on-interactive'], semanticDark['color-interactive-default']] },
  { name: 'on-danger / danger-default', usedBy: 'button--danger label, navbar/sidebar notification dot', kind: 'normal',
    light: [semanticLight['color-on-danger'], semanticLight['color-danger-default']],
    dark:  [semanticDark['color-on-danger'], semanticDark['color-danger-default']] },

  // Active-nav / selected-option state (brand-primary text on brand-primary-subtle bg)
  { name: 'brand-primary / brand-primary-subtle', usedBy: 'navbar active link, sidebar active item, select active option', kind: 'normal',
    light: [semanticLight['color-brand-primary'], semanticLight['color-brand-primary-subtle']],
    dark:  [semanticDark['color-brand-primary'], semanticDark['color-brand-primary-subtle']] },

  // Avatar initials (interactive-default text on brand-primary-muted bg)
  { name: 'interactive-default / brand-primary-muted', usedBy: 'avatar initials', kind: 'normal',
    light: [semanticLight['color-interactive-default'], semanticLight['color-brand-primary-muted']],
    dark:  [semanticDark['color-interactive-default'], semanticDark['color-brand-primary-muted']] },

  // Badge variants — component sets its own dark-mode colors directly
  { name: 'badge--default text/bg', usedBy: 'badge (default variant)', kind: 'normal',
    light: [p('neutral-700'), p('neutral-100')],
    dark:  [p('neutral-300'), p('neutral-800')] },
  { name: 'badge--primary text/bg', usedBy: 'badge (primary variant)', kind: 'normal',
    light: [semanticLight['color-text-brand'], semanticLight['color-brand-primary-muted']],
    dark:  [p('violet-300'), p('violet-900')] },
  { name: 'badge--success text/bg', usedBy: 'badge (success variant)', kind: 'normal',
    light: [semanticLight['color-text-success'], semanticLight['color-success-muted']],
    dark:  [p('green-300'), p('green-900')] },
  { name: 'badge--warning text/bg', usedBy: 'badge (warning variant)', kind: 'normal',
    light: [semanticLight['color-text-warning'], semanticLight['color-warning-muted']],
    dark:  [p('amber-300'), p('amber-900')] },
  { name: 'badge--danger text/bg', usedBy: 'badge (danger variant)', kind: 'normal',
    light: [semanticLight['color-text-danger'], semanticLight['color-danger-muted']],
    dark:  [p('red-300'), p('red-900')] },
  { name: 'badge--info text/bg', usedBy: 'badge (info variant) — dark block re-sets identical values', kind: 'normal',
    light: [semanticLight['color-info-default'], semanticLight['color-info-muted']],
    dark:  [semanticLight['color-info-default'], semanticLight['color-info-muted']] },

  // Alert variants — no dark-mode override at all (component or semantic)
  { name: 'alert (info/default) fg/bg', usedBy: 'alert default variant — not theme-adjusted', kind: 'normal',
    light: [semanticLight['color-info-default'], semanticLight['color-info-subtle']],
    dark:  [semanticLight['color-info-default'], semanticLight['color-info-subtle']] },
  { name: 'alert--success fg/bg', usedBy: 'alert success variant — not theme-adjusted', kind: 'normal',
    light: [semanticLight['color-text-success'], semanticLight['color-success-subtle']],
    dark:  [semanticLight['color-text-success'], semanticLight['color-success-subtle']] },
  { name: 'alert--warning fg/bg', usedBy: 'alert warning variant — not theme-adjusted', kind: 'normal',
    light: [semanticLight['color-text-warning'], semanticLight['color-warning-subtle']],
    dark:  [semanticLight['color-text-warning'], semanticLight['color-warning-subtle']] },
  { name: 'alert--danger fg/bg', usedBy: 'alert danger variant — not theme-adjusted', kind: 'normal',
    light: [semanticLight['color-text-danger'], semanticLight['color-danger-subtle']],
    dark:  [semanticLight['color-text-danger'], semanticLight['color-danger-subtle']] },
];

function analyze() {
  return pairs.map((pair) => {
    const isUi = pair.kind === 'ui';
    const lightRatio = contrastRatio(pair.light[0], pair.light[1]);
    const darkRatio = contrastRatio(pair.dark[0], pair.dark[1]);
    return {
      ...pair,
      lightRatio,
      darkRatio,
      lightAA: aaPass(lightRatio, isUi),
      darkAA: aaPass(darkRatio, isUi),
      lightAAA: isUi ? null : aaaPass(lightRatio, false),
      darkAAA: isUi ? null : aaaPass(darkRatio, false),
    };
  });
}

function main() {
  const results = analyze();
  const asMarkdown = process.argv.includes('--markdown');

  if (asMarkdown) {
    const rows = results.map((r) => {
      const aaaCol = (v) => (v === null ? 'N/A' : v ? 'Pass' : 'Fail');
      return `| ${r.name} | ${r.light[0]} on ${r.light[1]} | ${r.dark[0]} on ${r.dark[1]} | ${fmtRatio(r.lightRatio)} | ${fmtRatio(r.darkRatio)} | ${r.lightAA ? 'Pass' : 'Fail'} / ${r.darkAA ? 'Pass' : 'Fail'} | ${aaaCol(r.lightAAA)} / ${aaaCol(r.darkAAA)} |`;
    });
    console.log(rows.join('\n'));
  } else {
    for (const r of results) {
      const status = (ok) => (ok ? 'PASS' : 'FAIL');
      console.log(
        `${r.name.padEnd(42)} light ${fmtRatio(r.lightRatio).padEnd(8)} AA:${status(r.lightAA)}  ` +
        `dark ${fmtRatio(r.darkRatio).padEnd(8)} AA:${status(r.darkAA)}`
      );
    }
    const failing = results.filter((r) => !r.lightAA || !r.darkAA);
    console.log(`\n${results.length} pairs checked, ${failing.length} failing AA in at least one theme.`);
  }
}

main();

module.exports = { hexToRgb, relativeLuminance, contrastRatio, pairs, analyze };
