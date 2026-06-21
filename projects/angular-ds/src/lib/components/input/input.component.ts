import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { FormErrorComponent } from '../form-error/form-error.component';
import type { InputSize, InputStatus, InputType } from './input.types';

let nextId = 0;

@Component({
  selector: 'ds-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor {
  type        = input<InputType>('text');
  size        = input<InputSize>('md');
  status      = input<InputStatus>('default');
  label       = input<string>('');
  placeholder = input('');
  helperText  = input('');
  errorMessage= input('');
  disabled    = input(false);
  required    = input(false);
  readonly    = input(false);
  name        = input('');
  autocomplete= input('off');

  valueChange = output<string>();

  readonly uid      = `ds-input-${++nextId}`;
  readonly helperId = `${this.uid}-helper`;

  value     = signal('');
  isFocused = signal(false);
  ngControl: NgControl | null = null;

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    const ctrl = inject(NgControl, { optional: true, self: true });
    if (ctrl) ctrl.valueAccessor = this;
    this.ngControl = ctrl;
  }

  hasError = computed(() => {
    if (this.status() === 'error') return true;
    const ctrl = this.ngControl?.control;
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  });

  resolvedError = computed(() => {
    if (this.errorMessage()) return this.errorMessage();
    const ctrl = this.ngControl?.control;
    if (!ctrl || !ctrl.errors) return '';
    if (ctrl.errors['required'])  return 'This field is required.';
    if (ctrl.errors['email'])     return 'Enter a valid email address.';
    if (ctrl.errors['minlength']) return `Minimum ${ctrl.errors['minlength'].requiredLength} characters required.`;
    if (ctrl.errors['maxlength']) return `Maximum ${ctrl.errors['maxlength'].requiredLength} characters allowed.`;
    if (ctrl.errors['pattern'])   return 'Invalid format.';
    return 'Invalid value.';
  });

  wrapperClasses = computed(() => [
    'ds-input-wrapper',
    `ds-input-wrapper--${this.size()}`,
    this.hasError() ? 'ds-input-wrapper--error' : `ds-input-wrapper--${this.status()}`,
    this.disabled()  ? 'ds-input-wrapper--disabled' : '',
    this.isFocused() ? 'ds-input-wrapper--focused'  : '',
  ].filter(Boolean).join(' '));

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
    this.valueChange.emit(val);
  }

  onFocus(): void { this.isFocused.set(true); }
  onBlur(): void  { this.isFocused.set(false); this.onTouched(); }

  writeValue(val: string): void { this.value.set(val ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(): void {}
}
