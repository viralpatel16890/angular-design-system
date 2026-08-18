import type { ValidationErrors } from '@angular/forms';

/**
 * Angular's standard validator error keys that ds-input, ds-select, and
 * ds-checkbox know how to turn into a human-readable message.
 */
export type ValidationErrorKey = 'required' | 'email' | 'minlength' | 'maxlength' | 'pattern';

/**
 * Default check order, matching the order every component previously used
 * when it hardcoded this mapping: required, then email, then minlength,
 * then maxlength, then pattern.
 */
export const DEFAULT_VALIDATION_ERROR_ORDER: readonly ValidationErrorKey[] = [
  'required',
  'email',
  'minlength',
  'maxlength',
  'pattern',
];

/**
 * Maps a single known validator error key to its display message.
 * `errors` must contain the key (the caller checks presence via `keys`).
 */
function messageFor(key: ValidationErrorKey, errors: ValidationErrors): string {
  switch (key) {
    case 'required':
      return 'This field is required.';
    case 'email':
      return 'Enter a valid email address.';
    case 'minlength':
      return `Minimum ${errors['minlength'].requiredLength} characters required.`;
    case 'maxlength':
      return `Maximum ${errors['maxlength'].requiredLength} characters allowed.`;
    case 'pattern':
      return 'Invalid format.';
  }
}

/**
 * Resolves a form control's `errors` object to the display message a field
 * should show for it.
 *
 * - Returns `null` when there are no errors to report.
 * - Checks `keys` in order and returns the message for the first key present
 *   on `errors`. Defaults to checking all five known keys
 *   (required/email/minlength/maxlength/pattern), matching ds-input's
 *   original behavior. Pass a narrower `keys` list (e.g. `['required',
 *   'pattern']`) to match a component that only ever handled a subset of
 *   validators, such as ds-select and ds-checkbox.
 * - Falls back to a generic 'Invalid value.' message when `errors` is
 *   non-empty but none of the checked keys are present.
 */
export function getValidationErrorMessage(
  errors: ValidationErrors | null | undefined,
  keys: readonly ValidationErrorKey[] = DEFAULT_VALIDATION_ERROR_ORDER,
): string | null {
  if (!errors) return null;
  for (const key of keys) {
    if (key in errors) return messageFor(key, errors);
  }
  return 'Invalid value.';
}
