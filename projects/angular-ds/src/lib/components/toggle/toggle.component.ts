import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FormErrorComponent } from '../form-error/form-error.component';
import type { ToggleSize, ToggleLabelPosition } from './toggle.types';

let nextId = 0;

@Component({
  selector: 'ds-toggle',
  standalone: true,
  imports: [FormErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss',
})
export class ToggleComponent implements ControlValueAccessor, OnInit {
  size           = input<ToggleSize>('md');
  label          = input('');
  labelPosition  = input<ToggleLabelPosition>('right');
  helperText     = input('');
  disabled       = input(false);
  required       = input(false);
  defaultChecked = input(false, { alias: 'checked' });

  checkedChange = output<boolean>();

  readonly uid      = `ds-toggle-${++nextId}`;
  readonly helperId = `${this.uid}-helper`;

  checked   = signal(false);
  ngControl: NgControl | null = null;

  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};

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
    const ctrl = this.ngControl?.control;
    if (!ctrl || !ctrl.errors) return '';
    if (ctrl.errors['required']) return 'This field is required.';
    if (ctrl.errors['pattern'])  return 'Invalid format.';
    return 'Invalid value.';
  });

  wrapperClasses = computed(() => [
    'ds-toggle-wrapper',
    `ds-toggle-wrapper--${this.size()}`,
    `ds-toggle-wrapper--label-${this.labelPosition()}`,
    this.disabled() ? 'ds-toggle-wrapper--disabled' : '',
  ].filter(Boolean).join(' '));

  ngOnInit(): void {
    if (this.defaultChecked()) this.checked.set(true);
  }

  toggle(): void {
    if (this.disabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
    this.checkedChange.emit(next);
  }

  onBlur(): void { this.onTouched(); }

  writeValue(val: boolean): void { this.checked.set(!!val); }
  registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(): void {}
}
