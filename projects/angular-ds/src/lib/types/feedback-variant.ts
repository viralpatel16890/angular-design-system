// Canonical feedback-variant enumeration shared by all components that
// communicate status/severity (e.g. Alert, Toast). Keeping a single source
// of truth here prevents the per-component variant unions from drifting —
// e.g. one component gaining a new variant, or their "danger" naming
// diverging (as previously happened with Toast's `'error'`).
//
// `'danger'` was chosen as the canonical name for the severe/negative
// variant because it's what the rest of the design system already uses for
// this concept — see ButtonVariant and BadgeVariant.
export type FeedbackVariant = 'info' | 'success' | 'warning' | 'danger';
