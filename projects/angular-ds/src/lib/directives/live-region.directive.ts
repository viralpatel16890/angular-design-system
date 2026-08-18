import { Directive, HostBinding, input } from '@angular/core';

/**
 * ARIA politeness level for a live region.
 * - `polite`  — announced when the screen reader is idle (status updates, ticking values).
 * - `assertive` — announced immediately, interrupting other speech (errors, urgent alerts).
 */
export type LiveRegionPoliteness = 'polite' | 'assertive';

/**
 * Applies the `aria-live` / `aria-atomic` / `role` attributes that turn a host element into a
 * correctly-configured ARIA live region.
 *
 * This is the single source of truth for "how do you announce dynamic content in this
 * codebase" — components that need to tell assistive tech about changing content (toasts,
 * tickers, inline status messages, etc.) should apply this directive instead of hand-rolling
 * the attribute trio, which is easy to get subtly wrong (mismatched politeness, a missing
 * `aria-atomic`, or applying the attributes to a node that gets torn down and re-created
 * instead of updated in place — which means screen readers never pick it up).
 *
 * The host element must be a stable DOM node that persists across content updates (e.g. via
 * `@if`/`@for` on its *children*, not on the element carrying this directive) — the live
 * region only works if assistive tech can keep watching the same node.
 *
 * @example Polite status region (default role="status", atomic, non-interrupting)
 * ```html
 * <div dsLiveRegion="polite">{{ statusMessage() }}</div>
 * ```
 *
 * @example Assertive alert (default role="alert", interrupts immediately)
 * ```html
 * <div dsLiveRegion="assertive">{{ errorMessage() }}</div>
 * ```
 *
 * @example Landmark region that is also a live region (own role wins, e.g. toast container)
 * ```html
 * <div dsLiveRegion="polite" dsLiveRegionRole="region" [dsLiveRegionAtomic]="false" aria-label="Notifications">
 * ```
 */
@Directive({
  selector: '[dsLiveRegion]',
  standalone: true,
})
export class LiveRegionDirective {
  /** Politeness level applied as `aria-live`. Required — there is no safe default. */
  readonly politeness = input.required<LiveRegionPoliteness>({ alias: 'dsLiveRegion' });

  /**
   * Whether assistive tech re-announces the whole region on any change (`true`) or only the
   * changed nodes (`false`). Defaults to `true`, which is correct for almost every live region
   * (a short toast, an alert, a single ticking value) — pass `false` only for a persistent
   * container that accumulates multiple independent messages over time (e.g. a toast list),
   * where re-reading the whole container on every addition would be disruptive.
   */
  readonly atomic = input(true, { alias: 'dsLiveRegionAtomic' });

  /**
   * ARIA role to pair with the live region. Defaults to the conventional role-free-of-name
   * pairing for the given politeness: `status` for `polite`, `alert` for `assertive`. Pass an
   * explicit role (e.g. `region`) when the element already has a broader landmark semantic, or
   * `null` to omit the role attribute entirely.
   */
  readonly role = input<string | null | undefined>(undefined, { alias: 'dsLiveRegionRole' });

  @HostBinding('attr.aria-live')
  get ariaLive(): LiveRegionPoliteness {
    return this.politeness();
  }

  @HostBinding('attr.aria-atomic')
  get ariaAtomic(): string {
    return String(this.atomic());
  }

  @HostBinding('attr.role')
  get computedRole(): string | null {
    const explicit = this.role();
    if (explicit === null) {
      return null;
    }
    if (explicit !== undefined) {
      return explicit;
    }
    return this.politeness() === 'assertive' ? 'alert' : 'status';
  }
}
