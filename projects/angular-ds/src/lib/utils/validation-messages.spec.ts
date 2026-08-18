import { getValidationErrorMessage } from './validation-messages';

describe('getValidationErrorMessage', () => {
  it('returns null when errors is null', () => {
    expect(getValidationErrorMessage(null)).toBeNull();
  });

  it('returns null when errors is undefined', () => {
    expect(getValidationErrorMessage(undefined)).toBeNull();
  });

  it('falls back to "Invalid value." when errors is a non-null empty object', () => {
    // An empty object is truthy, so a control with `errors = {}` is treated
    // the same as a control with an unrecognized error key — this matches
    // the pre-refactor per-component `if (!ctrl.errors) return '';` guards,
    // which only short-circuit on a null/undefined errors object.
    expect(getValidationErrorMessage({})).toBe('Invalid value.');
  });

  it('maps required to "This field is required."', () => {
    expect(getValidationErrorMessage({ required: true })).toBe('This field is required.');
  });

  it('maps email to "Enter a valid email address."', () => {
    expect(getValidationErrorMessage({ email: true })).toBe('Enter a valid email address.');
  });

  it('maps minlength to a message including the required length', () => {
    expect(getValidationErrorMessage({ minlength: { requiredLength: 5, actualLength: 2 } }))
      .toBe('Minimum 5 characters required.');
  });

  it('maps maxlength to a message including the required length', () => {
    expect(getValidationErrorMessage({ maxlength: { requiredLength: 10, actualLength: 12 } }))
      .toBe('Maximum 10 characters allowed.');
  });

  it('maps pattern to "Invalid format."', () => {
    expect(getValidationErrorMessage({ pattern: { requiredPattern: '^[a-z]+$', actualValue: '123' } }))
      .toBe('Invalid format.');
  });

  it('falls back to "Invalid value." for an unrecognized error key', () => {
    expect(getValidationErrorMessage({ custom: true })).toBe('Invalid value.');
  });

  it('checks keys in default priority order: required before email/minlength/maxlength/pattern', () => {
    expect(getValidationErrorMessage({ required: true, email: true, pattern: true })).toBe(
      'This field is required.',
    );
  });

  it('checks keys in default priority order: email before minlength/maxlength/pattern', () => {
    expect(
      getValidationErrorMessage({
        email: true,
        minlength: { requiredLength: 5, actualLength: 1 },
        maxlength: { requiredLength: 10, actualLength: 20 },
        pattern: true,
      }),
    ).toBe('Enter a valid email address.');
  });

  it('checks keys in default priority order: minlength before maxlength/pattern', () => {
    expect(
      getValidationErrorMessage({
        minlength: { requiredLength: 5, actualLength: 1 },
        maxlength: { requiredLength: 10, actualLength: 20 },
        pattern: true,
      }),
    ).toBe('Minimum 5 characters required.');
  });

  it('checks keys in default priority order: maxlength before pattern', () => {
    expect(
      getValidationErrorMessage({
        maxlength: { requiredLength: 10, actualLength: 20 },
        pattern: true,
      }),
    ).toBe('Maximum 10 characters allowed.');
  });

  it('supports a restricted key list, e.g. ["required", "pattern"] used by ds-select/ds-checkbox', () => {
    const keys = ['required', 'pattern'] as const;
    expect(getValidationErrorMessage({ required: true }, keys)).toBe('This field is required.');
    expect(getValidationErrorMessage({ pattern: true }, keys)).toBe('Invalid format.');
  });

  it('falls back to "Invalid value." with a restricted key list when only unchecked keys are present', () => {
    const keys = ['required', 'pattern'] as const;
    expect(getValidationErrorMessage({ email: true }, keys)).toBe('Invalid value.');
    expect(
      getValidationErrorMessage({ minlength: { requiredLength: 3, actualLength: 1 } }, keys),
    ).toBe('Invalid value.');
    expect(
      getValidationErrorMessage({ maxlength: { requiredLength: 3, actualLength: 9 } }, keys),
    ).toBe('Invalid value.');
  });

  it('respects a restricted key list order over the default priority', () => {
    const keys = ['pattern', 'required'] as const;
    expect(getValidationErrorMessage({ required: true, pattern: true }, keys)).toBe('Invalid format.');
  });
});
