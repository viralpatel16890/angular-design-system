import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FormErrorComponent } from '../form-error/form-error.component';
import type { CheckboxSize, CheckboxLabelPosition } from './checkbox.types';

let nextId = 0;

@Component({
  selector: 'ds-checkbox',
  standalone: true,
  imports: [FormErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  size           = input<CheckboxSize>('md');
  label          = input('');
  labelPosition  = input<CheckboxLabelPosition>('right');
  helperText     = input('');
  disabled       = input(false);
  required       = input(false);
  indeterminate  = input(false);
  defaultChecked = input(false, { alias: 'checked' });

  checkedChange = output<boolean>();

  readonly uid      = `ds-checkbox-${++nextId}`;
  readonly helperId = `${this.uid}-helper`;

  checked = signal(false);
  inputRef = viewChild<ElementRef<HTMLInputElement>>('inputEl');
  ngControl: NgControl | null = null;

  private onChange: (v: boolean) => void = () => {};
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
    const ctrl = this.ngControl?.control;
    if (!ctrl || !ctrl.errors) return '';
    if (ctrl.errors['required']) return 'This field is required.';
    if (ctrl.errors['pattern'])  return 'Invalid format.';
    return 'Invalid value.';
  });

  hostClasses = computed(() => [
    'ds-checkbox-wrapper',
    `ds-checkbox-wrapper--${this.size()}`,
    `ds-checkbox-wrapper--label-${this.labelPosition()}`,
    this.disabled() ? 'ds-checkbox-wrapper--disabled' : '',
  ].filter(Boolean).join(' '));

  ngOnInit(): void {
    if (this.defaultChecked()) this.checked.set(true);
  }

  ngAfterViewInit(): void {
    const el = this.inputRef()?.nativeElement;
    if (el && this.indeterminate()) el.indeterminate = true;
  }

  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).checked;
    this.checked.set(val);
    this.onChange(val);
    this.checkedChange.emit(val);
  }

  onBlur(): void { this.onTouched(); }

  writeValue(val: boolean): void { this.checked.set(!!val); }
  registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(): void {}
}
