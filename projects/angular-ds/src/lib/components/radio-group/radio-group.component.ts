import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FormErrorComponent } from '../form-error/form-error.component';
import { getValidationErrorMessage } from '../../utils/validation-messages';
import type { RadioGroupOrientation, RadioGroupSize } from './radio-group.types';

let nextId = 0;

/**
 * `ds-radio-group` — the `ControlValueAccessor` host for a set of `ds-radio`
 * options. It owns the selected value; individual `ds-radio` children need no
 * manual wiring — they `inject(RadioGroupComponent, { optional: true })`
 * (the same constructor-injection convention `ds-checkbox`/`ds-input`/
 * `ds-select` already use for `NgControl`) to read the shared `name`/`size`/
 * `disabled` state and to report activation back via `selectValue()`.
 *
 * A single native `name` (auto-generated, one per group instance) is shared
 * across every projected `ds-radio`'s native `<input type="radio">`, so the
 * browser handles roving-tabindex and Arrow/Home/End keyboard behavior for
 * free — no custom ARIA radiogroup keyboard handling is reimplemented here.
 *
 * ```html
 * <ds-radio-group label="Plan" [(ngModel)]="plan">
 *   <ds-radio value="free" label="Free" />
 *   <ds-radio value="pro" label="Pro" />
 * </ds-radio-group>
 * ```
 */
@Component({
  selector: 'ds-radio-group',
  standalone: true,
  imports: [FormErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss',
})
export class RadioGroupComponent implements ControlValueAccessor {
  size        = input<RadioGroupSize>('md');
  orientation = input<RadioGroupOrientation>('vertical');
  label       = input('');
  helperText  = input('');
  errorMessage= input('');
  disabled    = input(false);
  required    = input(false);

  valueChange = output<string>();

  readonly uid = `ds-radio-group-${++nextId}`;
  /** Shared native `name` — groups every projected `ds-radio`'s native input. */
  readonly name     = this.uid;
  readonly helperId = `${this.uid}-helper`;
  readonly errorId  = `${this.uid}-error`;

  value = signal<string | null>(null);
  ngControl: NgControl | null = null;

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  // Inject NgControl in constructor — avoids NG0200 circular dep caused by
  // having both NG_VALUE_ACCESSOR in providers AND injecting NgControl as a field.
  constructor() {
    const ctrl = inject(NgControl, { optional: true, self: true });
    if (ctrl) ctrl.valueAccessor = this;
    this.ngControl = ctrl;
  }

  hasError = computed(() => {
    const ctrl = this.ngControl?.control;
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  });

  resolvedError = computed(() => {
    if (this.errorMessage()) return this.errorMessage();
    const ctrl = this.ngControl?.control;
    return getValidationErrorMessage(ctrl?.errors, ['required']) ?? '';
  });

  describedBy = computed(() => {
    const ids: string[] = [];
    if (this.helperText()) ids.push(this.helperId);
    if (this.hasError())   ids.push(this.errorId);
    return ids.length ? ids.join(' ') : null;
  });

  groupClasses = computed(() => [
    'ds-radio-group',
    `ds-radio-group--${this.size()}`,
    `ds-radio-group--${this.orientation()}`,
    this.disabled() ? 'ds-radio-group--disabled' : '',
  ].filter(Boolean).join(' '));

  /** Called by a child `ds-radio` when its native input fires `change`. */
  selectValue(next: string): void {
    if (this.disabled()) return;
    if (this.value() === next) return;
    this.value.set(next);
    this.onChange(next);
    this.valueChange.emit(next);
  }

  /** Called by a child `ds-radio` on native `blur`. */
  notifyTouched(): void {
    this.onTouched();
  }

  writeValue(val: string): void { this.value.set(val ?? null); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(): void {}
}
