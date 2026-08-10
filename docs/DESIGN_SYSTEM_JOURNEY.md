# From design tokens to a shipped product: how this repo fits together

This doc explains how a value defined once in `design-tokens/` ends up as a pixel in
TradeDesk, and why building it as a shared Angular library — rather than copy-pasting
components per app — pays off at enterprise scale.

## 1. The four-layer flow

```
design-tokens/tokens.json          (Figma / Tokens Studio source, hand-synced)
        │
        ▼
_primitives.scss                    Tier 1 — raw values (color-neutral-400: #a3a3a3)
        │  never used directly by components
        ▼
_semantic.scss                      Tier 2 — intent-based aliases (color-text-tertiary)
        │  components consume this tier
        ▼
component tokens (per component)    Tier 3 — e.g. --ds-button-bg, --ds-card-radius
        │
        ▼
projects/angular-ds (the library)   ds-button, ds-card, ds-navbar, ds-crypto-ticker...
        │  + services: ThemeService (theme/brand switching), ToastService (global notifications)
        │
        ├──────────────┬──────────────────────────┐
        ▼              ▼                           ▼
  projects/showcase   projects/consumer-demo   (any future consumer app)
  (component gallery)  "TradeDesk" (real product UI)
```

A `stylelint` plugin (`tools/stylelint-plugin-gds`) enforces that components only ever
reference Tier 2/3 tokens, never raw primitives — so a rebrand is a token-file edit, not
a find-and-replace across dozens of components.

## 2. Suggested walkthrough for a first-time visitor

1. **Land on Showcase** (`/`) — see the full component catalog grouped by type (Navbar,
   Sidebar, Tabs, Buttons, Inputs, Cards, Fintech components, etc).
2. **Toggle dark mode / open the theme customizer** — every component on the page
   restyles instantly. This is the token system working: nothing here is a
   component-level override, it's `[data-theme="dark"]` swapping ~15 semantic tokens.
3. **Scroll to "Consuming the Design System"** — the `npm install angular-ds` snippet
   and the usage table show exactly which components a real app pulls in and why.
4. **Open TradeDesk** (`/consumer/`) — the same primitives, now assembled into a
   trading-desk product: portfolio cards, KPI metrics, a trade form, a transaction list.
5. **Submit the trade form** — see a service in action: `ds-select`/`ds-input` two-way
   binding, `ds-alert` validation feedback on a bad trade, and a `ToastService.show()`
   confirmation toast on success.
6. **Compare the two apps side by side** — identical button shapes, spacing, focus
   rings, and type scale, despite zero shared page-level code. That consistency is the
   product of the library, not of two teams remembering to match each other.

## 3. Why an Angular library, at enterprise scale

- **One fix, every app.** A component bug or a11y gap (e.g. focus-trap, contrast) is
  fixed once in `angular-ds` and every consuming team picks it up on their next
  `npm update`, instead of being patched N times across N codebases.
- **Design and code stay in the same units.** Tokens flow from Figma → `tokens.json` →
  SCSS/CSS custom properties, so "spacing-4" means the same 16px everywhere a designer
  or engineer looks.
- **Governed rollout via semver.** Breaking changes are opt-in — teams upgrade the
  library on their own schedule instead of a shared page being edited out from under
  them.
- **Tree-shakeable sub-path imports** (`angular-ds/button`, `angular-ds/navbar`) mean
  consumers only ship the components they actually use.
- **Accessibility is centralized.** Focus traps, `aria-live` announcements, and
  reduced-motion handling are implemented once by people who specialize in it, instead
  of every product team re-deriving it under deadline pressure.
- **Faster onboarding.** A new team building a new app starts from a working,
  documented component set (this Showcase) instead of a blank Figma file.
