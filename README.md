# Angular Design System

> A production-ready Angular 22 component library built on a three-tier design token architecture — powering consistent, accessible, and themeable UIs out of the box.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-angular--design--system--blue.vercel.app-000?logo=vercel&logoColor=white)](https://angular-design-system-blue.vercel.app/)
[![TradeDesk Consumer Demo](https://img.shields.io/badge/TradeDesk%20Demo-%2Fconsumer%2F-000?logo=vercel&logoColor=white)](https://angular-design-system-blue.vercel.app/consumer/)

![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![npm](https://img.shields.io/badge/npm-angular--ds-CB3837?logo=npm&logoColor=white)

---

## Summary

The **Angular Design System** (published as `angular-ds`) is a standalone Angular 22 component library that provides **24 polished UI components** backed by a three-tier CSS custom-property token system — 19 general-purpose UI components plus 5 fintech-domain components (`ds-alert`, `ds-balance-card`, `ds-crypto-ticker`, `ds-metric-card`, `ds-transaction-item`) for building trading, banking, and portfolio interfaces. All component selectors use the `ds-` prefix (e.g. `<ds-button>`, `<ds-tabs>`, `<ds-balance-card>`). It is built for Angular application teams who want a consistent, dark-mode-capable, and token-driven UI layer without the overhead of integrating a third-party design system. Every component is a standalone Angular component (no NgModule required), supports `ControlValueAccessor` where appropriate, and ships with zero runtime dependencies beyond Angular itself. Two companion apps prove the library out: the **Showcase**, which demonstrates every component in a live, interactive gallery, and **TradeDesk** (`consumer-demo`), a realistic trading-desk UI built entirely on `angular-ds` components — both run locally and deploy together.

---

## Benefits for Large-Scale Enterprise Applications

Angular Design System is purpose-built for enterprise scale. Its three-tier token architecture (Primitive → Semantic → Component) creates a single source of truth across all 24 components, so a brand colour, radius, or typography change propagates everywhere without touching individual files — and multi-brand or white-label theming is a one-call runtime override via `ThemeService.applyTheme()`. Every component ships WCAG 2.2 AA compliant with correct ARIA roles, full keyboard navigation, Angular CDK focus trapping, and screen reader announcements, checked with axe-core (via Storybook's `addon-a11y`) and Playwright accessibility tests (`npm run e2e`); these are run locally today — the CI workflow currently runs the build and unit test suite only, not e2e/a11y checks. Components are standalone, signals-first (`input()`, `computed()`, `OnPush`), tree-shakeable, and carry zero runtime dependencies beyond Angular, making them safe for large monorepos with complex dependency graphs. Form-bound components implement `ControlValueAccessor` natively, eliminating wrapper boilerplate. Contribution quality is locked in by Stylelint token-tier rules, Conventional Commits, Release Please, and Husky pre-commit hooks, while Style Dictionary 5 bridges Figma and code through a single token file so design and engineering stay in sync automatically. The library is proven in two real apps — the component-gallery Showcase and the TradeDesk consumer demo — and all 24 components are verified responsive across mobile, tablet, and desktop.

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | 22 LTS |
| npm | 10.x |
| Angular CLI | 22.x |
| TypeScript | 6.0.x |
| Storybook | 10.x |
| Style Dictionary | 5.x |
| Stylelint | 17.x |
| Vitest | 4.x |
| Playwright | 1.52.x |
| commitlint | 21.x |

> **Note:** Storybook 10 has an unresolved peer-dependency conflict between Angular 22 and TypeScript 6. `.npmrc` sets `legacy-peer-deps=true` as a workaround for `npm install`, but `npm run storybook` / `npm run build-storybook` are not guaranteed to run cleanly until upstream compatibility lands — see [What's Implemented → Storybook](#1-storybook).

Install the Angular CLI globally if you haven't already:

```bash
npm install -g @angular/cli@22
```

---

## Installation

### Running the workspace locally

```bash
# 1. Clone the repository
git clone https://github.com/your-org/angular-design-system.git
cd angular-design-system

# 2. Install dependencies
npm install

# 3. Launch the Showcase app
npm start
# Visit http://localhost:4200

# 4. Or launch the TradeDesk consumer demo instead
ng serve consumer-demo
# Visit http://localhost:4200 (stop the Showcase first, or pass --port to run both)
```

The workspace has three projects: the `angular-ds` library, the **Showcase** component gallery, and **consumer-demo** (TradeDesk), a realistic trading-desk app built on `angular-ds`. See [TradeDesk: A Consumer App, Not Just a Gallery](#tradedesk-a-consumer-app-not-just-a-gallery) below.

### Consuming the library in an external Angular project

Install the published package:

```bash
npm install angular-ds
```

Import the global design tokens in your `styles.scss`:

```scss
@use 'angular-ds/styles/tokens';
```

Or reference them in `angular.json`:

```json
"styles": ["node_modules/angular-ds/styles/tokens.css"]
```

---

## Usage & Consumption

### Importing standalone components

Every component is tree-shakeable and can be imported from the root package or from a named sub-path:

```typescript
import { Component } from '@angular/core';
// Root import (unchanged, backward-compatible)
import { ButtonComponent, InputComponent, CardComponent } from 'angular-ds';
// Sub-path imports (v0.0.1+) — same bundle, cleaner import surface
import { TabsComponent }      from 'angular-ds/tabs';
import { AccordionComponent } from 'angular-ds/accordion';
import { AvatarComponent }    from 'angular-ds/avatar';
import { TooltipComponent }   from 'angular-ds/tooltip';
import { ProgressComponent }  from 'angular-ds/progress';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonComponent, InputComponent, CardComponent],
  template: `
    <ds-card>
      <ds-input label="Email" placeholder="you@example.com" />
      <ds-button variant="primary">Submit</ds-button>
    </ds-card>
  `,
})
export class AppComponent {}
```

### Form-bound components with `ngModel`

The `Input`, `Select`, `Checkbox`, and `Toggle` components implement `ControlValueAccessor` and work with both template-driven and reactive forms.

**Template-driven (`ngModel`):**

```typescript
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  InputComponent,
  SelectComponent,
  CheckboxComponent,
  ToggleComponent,
} from 'angular-ds';
import type { SelectOption } from 'angular-ds';

@Component({
  standalone: true,
  imports: [FormsModule, InputComponent, SelectComponent, CheckboxComponent, ToggleComponent],
  template: `
    <ds-input    label="Username"               [(ngModel)]="username" />
    <ds-select   label="Role" [options]="roles" [(ngModel)]="role"     />
    <ds-checkbox label="Accept terms"           [(ngModel)]="accepted" />
    <ds-toggle   label="Notifications"          [(ngModel)]="notifyOn" />
  `,
})
export class ProfileFormComponent {
  username = signal('');
  role     = signal('');
  accepted = signal(false);
  notifyOn = signal(true);

  roles: SelectOption[] = [
    { label: 'Admin',  value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
  ];
}
```

**Reactive forms:**

```typescript
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputComponent, CheckboxComponent } from 'angular-ds';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, CheckboxComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <ds-input    label="Email"       formControlName="email"      />
      <ds-checkbox label="Remember me" formControlName="rememberMe" />
      <button type="submit">Log in</button>
    </form>
  `,
})
export class LoginFormComponent {
  form = inject(FormBuilder).group({
    email:      ['', [Validators.required, Validators.email]],
    rememberMe: [false],
  });

  submit() { console.log(this.form.value); }
}
```

### Dark mode toggle

Dark mode is controlled by a `data-theme="dark"` attribute on `<html>`. The View Transitions API (Chrome 111+) produces a smooth circular reveal animation when available:

```typescript
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleComponent } from 'angular-ds';

@Component({
  standalone: true,
  imports: [FormsModule, ToggleComponent],
  template: `
    <ds-toggle
      label="Dark mode"
      [(ngModel)]="isDark"
      (ngModelChange)="applyTheme($event)"
    />
  `,
})
export class ThemeToggleComponent {
  isDark = signal(false);

  applyTheme(dark: boolean): void {
    const apply = () =>
      dark
        ? document.documentElement.setAttribute('data-theme', 'dark')
        : document.documentElement.removeAttribute('data-theme');

    'startViewTransition' in document
      ? (document as any).startViewTransition(apply)
      : apply();
  }
}
```

**Persisting the user's preference:**

```typescript
const saved = localStorage.getItem('theme') ?? 'light';
document.documentElement.setAttribute('data-theme', saved);

function setTheme(theme: 'light' | 'dark') {
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}
```

### Token customisation via CSS custom properties

Override any token at `:root` or any ancestor selector:

```css
:root {
  /* Brand colour */
  --color-brand-primary: #4f46e5;

  /* Typography */
  --font-family-sans: 'Inter', sans-serif;

  /* Radius */
  --radius-md: 0.25rem;
}

[data-theme="dark"] {
  --color-surface-base: #0f172a;
  --color-text-primary: #f8fafc;
}
```

---

## Component Library

24 components in total: 19 general-purpose components plus 5 fintech-domain components.

> **Full API reference:** the tables below cover the highlights — for every component's complete inputs, outputs, overridable CSS custom properties, and a usage snippet, see [`docs/COMPONENTS.md`](./docs/COMPONENTS.md).

### General-purpose components

| Component | Selector | Description | Key Inputs | Key Outputs |
|---|---|---|---|---|
| **Button** | `<ds-button>` | Themed action button with multiple variants and sizes | `variant`, `size`, `disabled`, `loading`, `fullWidth` | `(pressed)` |
| **Input** | `<ds-input>` | Text field with label, helper text, and CVA support | `label`, `placeholder`, `type`, `disabled`, `readonly` | `(valueChange)` |
| **Card** | `<ds-card>` | Layout container composed of Header, Body, and Footer sub-components | `elevated`, `bordered` | — |
| **Card Header** | `<ds-card-header>` | Slot for card titles and action elements | `title` | — |
| **Card Body** | `<ds-card-body>` | Content projection area inside a card | — | — |
| **Card Footer** | `<ds-card-footer>` | Footer slot for card actions or metadata | — | — |
| **Modal** | `<ds-modal>` | Accessible dialog built on the native `<dialog>` element | `open`, `title`, `size` | `(closed)` |
| **Badge** | `<ds-badge>` | Inline label for statuses, counts, and tags | `variant`, `size` | — |
| **Select** | `<ds-select>` | Custom dropdown with full keyboard navigation and CVA support | `label`, `options`, `placeholder`, `disabled` | `(valueChange)` |
| **Toast** | `<ds-toast-container>` + `ToastService` | Signal-based notification toasts dispatched via injectable service | — (inject `ToastService`) | — |
| **Navbar** | `<ds-navbar>` | Top navigation bar with items, badges, and active-item tracking | `brand`, `navItems` | `(navItemClick)` |
| **Sidebar** | `<ds-sidebar>` | Collapsible side navigation with grouped items and icon support | `groups`, `collapsed` | `(itemClick)` |
| **Checkbox** | `<ds-checkbox>` | Accessible checkbox with indeterminate state and CVA support | `label`, `checked`, `disabled`, `indeterminate` | `(checkedChange)` |
| **Toggle** | `<ds-toggle>` | On/off switch with label, helper text, sizes, and CVA support | `label`, `checked`, `disabled`, `size`, `helperText` | `(checkedChange)` |
| **Tabs** | `<ds-tabs>` | Accessible tab list with `line` and `pill` variants, full keyboard navigation (Arrow / Home / End). Manages selection state — place panel content in sibling `@if (activeTab === 'id')` blocks. | `tabs`, `activeId`, `variant`, `size`, `fullWidth` | `(tabChange)` |
| **Accordion** | `<ds-accordion>` | Collapsible content sections with CSS grid animation, single or multi-expand mode | `items`, `multiple`, `bordered` | `(itemToggle)` |
| **Avatar** | `<ds-avatar>` | User avatar — displays an image, falls back to initials, then to a generic person icon. Status dot indicator supported | `src`, `name`, `size`, `shape`, `color`, `status` | — |
| **Tooltip** | `<ds-tooltip>` | CSS-driven tooltip wrapping any trigger element, with four positional variants and a reduced-motion fade | `text`, `position`, `disabled` | — |
| **Progress** | `<ds-progress>` | Progress bar with semantic colour variants, three sizes, optional stripe animation, and ARIA `progressbar` role | `value`, `max`, `variant`, `size`, `label`, `showValue`, `striped`, `animated` | — |

### Fintech-domain components

Domain-specific components originally built for the TradeDesk consumer app, then ported into the library and restyled onto the same token system as every other component.

| Component | Selector | Description | Key Inputs | Key Outputs |
|---|---|---|---|---|
| **Alert** | `<ds-alert>` | Dismissible inline alert with `info`/`success`/`warning`/`danger` variants and an icon per variant | `variant`, `title`, `message`, `dismissible` | `(dismissed)` |
| **Balance Card** | `<ds-balance-card>` | KPI-style card for an account or portfolio balance, with a trend indicator and accent colour | `label`, `amount`, `currency`, `trend`, `icon`, `accent`, `period` | — |
| **Metric Card** | `<ds-metric-card>` | Compact KPI card for a single metric with a change indicator, optional prefix/suffix | `label`, `value`, `change`, `icon`, `prefix`, `suffix` | — |
| **Crypto Ticker** | `<ds-crypto-ticker>` | Live-style price ticker row for a crypto asset, with a 24h change indicator | `symbol`, `name`, `price`, `change24h`, `logo` | — |
| **Transaction Item** | `<ds-transaction-item>` | Single row in a transaction/trade history list — avatar, category, date, amount, debit/credit type, and status badge | `name`, `category`, `date`, `amount`, `type`, `status`, `avatar`, `clickable`, `ariaLabel` | `(itemClicked)` |

### Using `ToastService`

```typescript
import { Component, inject } from '@angular/core';
import { ToastService, ToastContainerComponent } from 'angular-ds';

@Component({
  standalone: true,
  imports: [ToastContainerComponent],
  template: `
    <ds-toast-container />
    <button (click)="notify()">Save</button>
  `,
})
export class PageComponent {
  private toast = inject(ToastService);

  notify(): void {
    this.toast.success('Saved successfully!');
    // Also available: .info()  .warning()  .error()  .show()
  }
}
```

---

## Token System

The design token architecture follows a strict **three-tier hierarchy**:

```
Tier 1 — Primitive Tokens
  Raw values, no semantic meaning
  --color-indigo-600: #4f46e5
  --space-4: 1rem

        │
        ▼

Tier 2 — Semantic Tokens
  Primitive aliases that express intent
  --color-brand-primary: var(--color-indigo-600)
  --color-surface-base:  var(--color-neutral-50)
  --color-text-primary:  var(--color-neutral-900)

        │
        ▼

Tier 3 — Component Tokens
  Semantic aliases scoped to one component
  --btn-bg:         var(--color-brand-primary)
  --btn-text:       var(--color-on-interactive)
  --cb-checked-bg:  var(--color-brand-primary)
```

**Rules enforced across the library:**
- Primitive tokens are **constants** — never overridden per theme.
- Dark mode remaps **semantic tokens only** under `[data-theme="dark"]` on `<html>`.
- Component styles reference **component or semantic tokens** exclusively — never primitives directly.
- Changing the brand colour requires updating a single semantic token; all components inherit it automatically.

---

## Dark Mode

Dark mode works by redefining the semantic token layer under `[data-theme="dark"]` on the `<html>` element. No per-component dark mode code exists — all components respond automatically via the token cascade.

**View Transitions animation:** The Showcase app wraps the theme toggle in `document.startViewTransition()`, which triggers a circular clip-path ripple that expands from the toggle button position (top-right corner). The animation uses `clip-path: circle()` and respects `prefers-reduced-motion` — users who prefer reduced motion get an instant switch.

---

## Live Theme Customizer

The Showcase app includes a built-in **Theme Customizer** accessible via the **"Theme" pill button** in the top-right corner of the header (four coloured dots — purple, green, red, amber — followed by the label "Theme"). Click it to open a floating panel where you can change the five core semantic colour groups in real time without reloading the page.

### How it works

| Picker | Tokens overridden | Components affected |
|---|---|---|
| **Brand Primary** | `--color-brand-primary`, `--color-interactive-default`, `--color-interactive-hover`, `--color-on-interactive`, `--color-border-interactive` and 4 more | Buttons (primary), Tabs active indicator, Checkboxes, Toggles, Select focus ring, Sidebar active item, Progress bar |
| **Success** | `--color-success-default`, `--color-success-subtle`, `--color-border-success`, `--color-text-success` and 3 more | Success badges, input valid states, success toasts, progress success variant |
| **Warning** | `--color-warning-default`, `--color-warning-subtle`, `--color-border-warning`, `--color-text-warning` and 3 more | Warning badges, warning toasts, progress warning variant |
| **Danger / Error** | `--color-danger-default`, `--color-danger-subtle`, `--color-border-danger`, `--color-text-danger`, `--color-on-danger` and 2 more | Danger buttons, error input states, error toasts, progress error variant |
| **Info / Accent** | `--color-info-default`, `--color-info-subtle`, `--color-border-info`, `--color-text-info` and 2 more | Info badges, informational elements |

### Token generation

Each picker hex value is converted to HSL, then a full semantic scale is derived automatically:

```typescript
// Example: picking #0ea5e9 as Brand Primary generates:
// --color-brand-primary:         #0ea5e9
// --color-brand-primary-subtle:  hsl(199, 78%, 96%)  ← very light tint
// --color-brand-primary-muted:   hsl(199, 78%, 90%)  ← light tint
// --color-interactive-default:   #0ea5e9
// --color-interactive-hover:     hsl(199, 89%, 33%)  ← 10% darker
// --color-on-interactive:        #ffffff              ← contrast-safe text
// --color-border-interactive:    #0ea5e9
// --focus-ring-color:            #0ea5e966            ← semi-transparent ring
```

Colour generation lives in `projects/showcase/src/app/color.utils.ts`. The maths uses HSL to compute shades (`hslToHex`) and `contrastColor()` picks either `#ffffff` or `#1e1b2e` based on the background lightness, guaranteeing readable text on any colour.

Clicking **Reset to defaults** removes all inline `style` overrides from `<html>` and restores the original design token values.

### Implementation notes

- Overrides are applied with `document.documentElement.style.setProperty()` — inline styles on `:root`, which take precedence over the stylesheet tokens without touching any SCSS or rebuilding the app.
- The customizer is entirely contained in `projects/showcase/src/app/theme-customizer/` and is not exported from the library package.
- Combined with the dark mode toggle, users can preview any brand colour in both light and dark mode simultaneously.

---

## Responsive Design

Every component is built mobile-first and tested across three breakpoints:

| Breakpoint | Width | Behaviour |
|---|---|---|
| **Mobile** | ≤ 640px | Single-column layouts, reduced padding, touch-optimised tap targets |
| **Tablet** | 641px – 768px | Two-column grids, intermediate spacing, sidebar collapses to overlay |
| **Desktop** | > 768px | Full multi-column layout, sidebar pinned, max-width 1200px container |

### Component-level responsive behaviour

**Navbar** — At ≤ 768px the nav links and action buttons are hidden and a hamburger button appears. Mobile menu opens as a full-width overlay drawer.

**Sidebar** — At ≤ 768px the sidebar becomes `position: fixed` and slides in from the left as an overlay with a blurred backdrop. A close button or backdrop tap dismisses it. At > 768px the sidebar is pinned inline and supports a collapse-to-icon mode.

**Modal** — At ≤ 640px the modal converts to a bottom sheet: it anchors to the bottom of the viewport with `max-height: 90dvh`, a slide-up enter animation, and rounded top corners only.

**Toast** — Width is clamped with `max-width: min(24rem, calc(100vw - 2rem))` so toasts never overflow the screen on small devices.

**Tabs** — The tab list scrolls horizontally (`overflow-x: auto`, no scrollbar) when tabs exceed the viewport width on mobile. This prevents wrapping that would collapse the line-variant underline indicator.

**Tooltip** — `left` and `right` positioned tooltips reflow to `top` on mobile (≤ 640px) to avoid horizontal overflow. Tooltip max-width is clamped to `min(14rem, 100vw - 2rem)`. The `focus-within` selector ensures keyboard users on touch devices can trigger tooltips via tab focus.

**Select** — The dropdown listbox uses `position: absolute; left: 0; right: 0` so it always matches the field width and never overflows horizontally.

**Accordion, Avatar, Progress, Badge, Checkbox, Toggle, Input, Button** — These components are intrinsically responsive: they are block/inline-flex elements that adapt to their container width without breakpoint overrides.

### Showcase app responsive layout

The Showcase demonstration app applies responsive grid adjustments:
- **≤ 1024px** — Section gaps reduced from `space-16` to `space-12`
- **≤ 768px** — Horizontal padding reduced, card grids use narrower minimum column widths, shell frames shortened to `24rem`
- **≤ 640px** — All grids collapse to single column, section titles scale down, shell frames at `20rem`, maximum padding `space-4`

---

## Building the Library

```bash
# Production build (default — uses ng-packagr)
ng build angular-ds

# Development build with watch mode
ng build angular-ds --configuration development --watch
```

Output is written to `dist/angular-ds/`. The npm package name in the emitted `package.json` is `angular-ds`.

**Pack as a tarball for distribution:**

```bash
ng build angular-ds
cd dist/angular-ds
npm pack
# Produces: dist/angular-ds/angular-ds-0.0.1.tgz
# dist/angular-ds/ is the complete publishable unit — tgz lives alongside the built package
```

**Local linking for testing in another project:**

```bash
cd dist/angular-ds && npm link
# In consuming project:
npm link angular-ds
```

---

## Running the Showcase

```bash
# Serve with hot reload (default port 4200)
ng serve showcase

# Or use the workspace shortcut
npm start
```

Navigate to [http://localhost:4200](http://localhost:4200). The Showcase demonstrates all 24 components (including the 5 fintech-domain components) with live controls, dark/light mode toggling with View Transitions animation, form bindings with `ngModel`, toast notifications, modal dialogs, navbar, and sidebar navigation. The header also carries quick-access **Demo** (jumps to the TradeDesk consumer app at `/consumer/`) and **Consume library** (jumps to the in-page "Consuming the Design System" section) links next to the theme toggle.

**Build the Showcase as a static site:**

```bash
ng build showcase --configuration production
# Output: dist/showcase/browser/
```

---

## TradeDesk: A Consumer App, Not Just a Gallery

The Showcase demonstrates every component in isolation. **TradeDesk** (`projects/consumer-demo`) is the second proof point: a realistic trading-desk UI built entirely on `angular-ds` components, showing them doing real work inside an actual app rather than a component gallery.

TradeDesk wires up:

| Component(s) | Used for |
|---|---|
| `ds-balance-card`, `ds-metric-card` | Portfolio value and performance KPIs |
| `ds-select`, `ds-input`, `ds-button` | A trade form with two-way `ngModel` binding and a loading state |
| `ds-alert` | Inline validation feedback when a trade fails to validate |
| `ds-transaction-item`, `ds-badge` | A transaction/trade history list with a status badge per row |
| `ds-toast-container`, `ToastService` | A confirmation toast after a trade executes |

```bash
# Serve TradeDesk with hot reload
ng serve consumer-demo
# Visit http://localhost:4200

# Build as a static site
ng build consumer-demo --configuration production --base-href /consumer/
# Output: dist/consumer-demo/browser/
```

Open the [live Showcase](https://angular-design-system-blue.vercel.app/) and follow the **Demo** link, or go directly to [`/consumer/`](https://angular-design-system-blue.vercel.app/consumer/), to see TradeDesk running.

---

## Deployment

Both the Showcase and TradeDesk (`consumer-demo`) are built and deployed together from a single **Vercel** project, defined by the root `vercel.json`:

```json
{
  "buildCommand": "npm run build:vercel",
  "outputDirectory": "dist/showcase/browser",
  "rewrites": [
    { "source": "/consumer/(.*)", "destination": "/consumer/index.html" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

`npm run build:vercel` runs three steps: `ng build showcase` (production), `ng build consumer-demo` (production, with `--base-href /consumer/`), then `scripts/copy-consumer-static.js`, which copies the built `consumer-demo` output into `dist/showcase/browser/consumer/` so a single static root serves both apps — Showcase at `/`, TradeDesk at `/consumer/`. This replaced the project's previous setup of two separate demo repos with independent deployments.

SSL, CDN, and previews for every push are handled by Vercel automatically; no Docker or custom server is required.

---

## Additional Scripts

| Script | Command | Description |
|---|---|---|
| Dev server | `npm start` | Serves the Showcase at `localhost:4200` |
| Dev server (TradeDesk) | `ng serve consumer-demo` | Serves the consumer demo at `localhost:4200` |
| Build library | `ng build angular-ds` | Outputs `dist/angular-ds/` |
| Build Showcase | `ng build showcase --configuration production` | Production static build |
| Build TradeDesk | `ng build consumer-demo --configuration production --base-href /consumer/` | Production static build |
| Build for Vercel | `npm run build:vercel` | Builds Showcase + TradeDesk and merges them into one deployable `dist/showcase/browser/` |
| Unit tests | `npm test` | Runs `ng test --watch=false` (Angular's unit-test builder) across `angular-ds`, `showcase`, and `consumer-demo` — 238 tests |
| Test watch | `npm run test:watch` | `ng test` in interactive watch mode |
| Test coverage | `npm run test:coverage` | Coverage report with 70% threshold |
| Storybook | `npm run storybook` | Launches Storybook on `localhost:6006` (peer-dependency caveat above) |
| Build Storybook | `npm run build-storybook` | Static Storybook build (peer-dependency caveat above) |
| E2E tests | `npm run e2e` | Playwright visual regression + a11y tests |
| Update snapshots | `npm run e2e:update-snapshots` | Regenerate Playwright baselines |
| Lint styles | `npm run lint:styles` | Stylelint with DS token-tier plugin |
| Build tokens | `npm run tokens:build` | Style Dictionary → CSS/SCSS/JS outputs |

---

## What's Implemented

This workspace ships the following engineering improvements end-to-end:

### 1. Storybook
`@storybook/angular` **10** configured with `addon-a11y` (essentials and interactions are now bundled into core in Storybook 10). Every component has a `.stories.ts` with multiple stories, arg controls, and a light/dark theme switcher in the toolbar. Run with `npm run storybook`. **Known issue:** there is an unresolved peer-dependency conflict between Angular 22 and TypeScript 6 in Storybook 10's dependency tree; `.npmrc` sets `legacy-peer-deps=true` to get `npm install` through, but `npm run storybook` / `npm run build-storybook` are not verified to run cleanly on top of that workaround — treat Storybook support as best-effort until upstream compatibility lands.

### 2. Unit Tests (Angular CLI Unit-Test Builder)
Full spec suite across all three projects — `angular-ds` (24 components), `showcase`, and `consumer-demo` — **238 tests total, all passing**, covering: signal input reflection, ControlValueAccessor (`writeValue` / `onChange` / `onTouched`), computed class output, ARIA attributes, and keyboard behaviour. `npm run test` runs `ng test --watch=false`, which uses `@angular/build:unit-test` (configured per-project in `angular.json`, Vitest-backed) rather than invoking Vitest directly — this replaced a previously broken raw-Vitest setup that didn't correctly exercise the workspace. 70% coverage thresholds and HTML + LCOV reporters via `npm run test:coverage`.

### 3. Angular CDK Accessibility
- **ModalComponent** — `FocusTrapFactory` from `@angular/cdk/a11y` creates a focus trap when the dialog opens and destroys it on close. Tab cycles only within the open modal.
- **ToastService** — `LiveAnnouncer` announces each toast message to screen readers (`assertive` for errors, `polite` for all others).

### 4. Style Dictionary Token Pipeline
Single source-of-truth token file at `design-tokens/tokens.json` (W3C DTCG format, Tokens Studio / Figma Variables compatible). `style-dictionary.config.js` (Style Dictionary **5**) builds to `design-tokens/build/`: CSS custom properties (`tokens.css`), SCSS variables (`_tokens.scss`), ES6 constants (`tokens.js`), and TypeScript declarations (`tokens.d.ts`). The token file contains the full indigo + cyan primitive scales, all semantic aliases, and a `color.semantic.defaults` section that mirrors the ThemeCustomizer's five colour defaults — keeping the JSON file and the runtime component in sync. Run with `npm run tokens:build`. `npm run tokens:check` rebuilds and diffs `design-tokens/build/` to catch drift, but it is not currently wired into `.github/workflows/ci.yml` — run it locally before committing token changes.

### 5. Multi-Brand ThemeService
`ThemeService` (`projects/angular-ds/src/lib/services/theme.service.ts`) — injectable service with `applyTheme(config)`, `resetTheme()`, `setDarkMode(bool)`, and `toggleDarkMode()`. Writes a `<style id="ds-theme-overrides">` tag to `<head>` for runtime brand overrides without touching component code.

```typescript
import { ThemeService } from 'angular-ds';

const theme = inject(ThemeService);
theme.applyTheme({ brandPrimary: '#e11d48', radiusMd: '2px' });
theme.setDarkMode(true);
```

### 6. Form Validation States
All four CVA components (Input, Select, Checkbox, Toggle) now optionally inject `NgControl` to detect `invalid && touched` state. A `hasError` computed signal drives the error class and a `resolvedError` computed signal maps standard Angular validator keys (`required`, `email`, `minlength`, `maxlength`, `pattern`) to human-readable messages. A shared `<ds-form-error>` sub-component renders the inline error with an icon.

### 7. RTL Layout Support
CSS directional properties (`padding-left`, `margin-left`) replaced with logical equivalents (`padding-inline-start`, `margin-inline-start`) in checkbox, toggle, and select SCSS. A single `dir="rtl"` attribute on `<html>` flips layouts without any additional CSS.

### 8. Stylelint Token-Tier Plugin
Custom Stylelint **17** plugin at `tools/stylelint-plugin-gds/` enforces the `ds/no-primitive-token-in-component` rule: warns when component SCSS references primitive tokens (e.g. `--color-indigo-600`) instead of semantic or component tokens. `.stylelintrc.json` applies it to all component files and exempts the token definition layer. Run with `npm run lint:styles`.

### 9. Playwright Visual Regression
`playwright.config.ts` targets Chromium against the Showcase at `localhost:4200`. Tests in `e2e/visual-regression.spec.ts` snapshot the full page and individual sections in both light and dark mode (`maxDiffPixelRatio: 0.02`). `e2e/accessibility.spec.ts` covers keyboard focus, modal Escape handling, and theme toggle. Generate baselines with `npm run e2e:update-snapshots`.

### 10. Conventional Commits + Release Please
`.commitlintrc.json` enforces `@commitlint/config-conventional` rules with a scope enum covering the common component and workspace scopes (`button`, `input`, `card`, `modal`, `select`, `toast`, `showcase`, `ci`, `deploy`, etc.). `.release-please-config.json` targets `projects/angular-ds` for automated semver bumps and `CHANGELOG.md` generation. `.github/workflows/ci.yml` builds the library and the Showcase and runs the full unit-test suite (`angular-ds`, `showcase`, `consumer-demo`) on every push/PR to `main` and `claude/**` branches — it does **not** currently run Storybook, Playwright e2e, or lint jobs. `.github/workflows/release.yml` triggers Release Please on pushes to `main`.

### 11. Sub-Path Package Exports (Tree-Shaking)
The distributed `package.json` declares an `exports` map with 23 named sub-paths — one per component, plus `theme` — in addition to the primary `.` entry. Consumers can import from a component sub-path for semantic clarity and better code-splitting hints:

```typescript
import { ButtonComponent }    from 'angular-ds/button';
import { ToastService }        from 'angular-ds/toast';
import { ThemeService }        from 'angular-ds/theme';
```

All sub-paths resolve to the same ESM bundle (`fesm2022/angular-ds.mjs`). Because the bundle is `"type": "module"` and declares `"sideEffects": false`, modern bundlers (webpack 5, Vite, esbuild) still tree-shake unused components regardless of import path. The exports map is applied by a post-build script (`scripts/patch-exports.js`) which runs via `npm run build:lib` — a workaround for a TypeScript 6 + ng-packagr 22 incompatibility that prevents true per-bundle secondary entries from compiling; this will be replaced with native ng-packagr secondary entries once upstream support lands.

### 12. SSR Guard in ThemeCustomizer
`ThemeCustomizerComponent` injects `PLATFORM_ID` and wraps all `document.documentElement.style.setProperty()` calls in an `isPlatformBrowser()` guard. This prevents `ReferenceError: document is not defined` on Angular Universal, Analog, or any server-side rendering host. Signal state updates (`colors`, `isOpen`) remain unconditional and work on all platforms.

---
