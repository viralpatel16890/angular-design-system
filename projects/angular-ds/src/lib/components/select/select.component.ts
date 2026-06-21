import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FormErrorComponent } from '../form-error/form-error.component';
import type { SelectSize, SelectStatus, SelectOption } from './select.types';

let nextId = 0;

@Component({
  selector: 'ds-select',
  standalone: true,
  imports: [CommonModule, FormErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements ControlValueAccessor {
  options     = input.required<SelectOption[]>();
  label       = input('');
  placeholder = input('Select an option');
  size        = input<SelectSize>('md');
  status      = input<SelectStatus>('default');
  helperText  = input('');
  disabled    = input(false);
  required    = input(false);

  valueChange = output<string>();

  readonly uid      = `ds-select-${++nextId}`;
  readonly listboxId= `${this.uid}-listbox`;
  readonly helperId = `${this.uid}-helper`;

  isOpen         = signal(false);
  activeIndex    = signal(-1);
  selectedValue  = signal<string | null>(null);
  isFocused      = signal(false);

  triggerRef = viewChild<ElementRef<HTMLButtonElement>>('triggerEl');
  listboxRef = viewChild<ElementRef<HTMLUListElement>>('listboxEl');
  ngControl: NgControl | null = null;

  private onChange: (v: string) => void = () => {};

  constructor() {
    const ctrl = inject(NgControl, { optional: true, self: true });
    if (ctrl) ctrl.valueAccessor = this;
    this.ngControl = ctrl;
  }
  private onTouched: () => void = () => {};

  hasError = computed(() => {
    if (this.status() === 'error') return true;
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

  selectedLabel = computed(() => {
    const val = this.selectedValue();
    if (!val) return null;
    return this.options().find(o => o.value === val)?.label ?? null;
  });

  triggerClasses = computed(() => [
    'ds-select__trigger',
    `ds-select__trigger--${this.size()}`,
    this.hasError() ? 'ds-select__trigger--error' : `ds-select__trigger--${this.status()}`,
    this.disabled()   ? 'ds-select__trigger--disabled' : '',
    this.isOpen()     ? 'ds-select__trigger--open'     : '',
    this.isFocused()  ? 'ds-select__trigger--focused'  : '',
  ].filter(Boolean).join(' '));

  open(): void {
    if (this.disabled()) return;
    this.isOpen.set(true);
    const currentIdx = this.options().findIndex(o => o.value === this.selectedValue());
    this.activeIndex.set(currentIdx >= 0 ? currentIdx : 0);
    setTimeout(() => this.scrollActiveIntoView());
  }

  close(): void {
    this.isOpen.set(false);
    this.activeIndex.set(-1);
    this.onTouched();
  }

  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  select(option: SelectOption): void {
    if (option.disabled) return;
    this.selectedValue.set(option.value);
    this.onChange(option.value);
    this.valueChange.emit(option.value);
    this.close();
    this.triggerRef()?.nativeElement.focus();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return;
    const el = (event.target as HTMLElement);
    if (!el.closest(`#${this.uid}-field`)) this.close();
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        event.preventDefault();
        this.isOpen() ? this.moveActive(1) : this.open();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.isOpen() ? this.moveActive(-1) : this.open();
        break;
      case 'Escape':
        if (this.isOpen()) { event.preventDefault(); this.close(); }
        break;
      case 'Tab':
        if (this.isOpen()) this.close();
        break;
    }
  }

  onOptionKeydown(event: KeyboardEvent, option: SelectOption, index: number): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.select(option);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveActive(-1);
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        this.triggerRef()?.nativeElement.focus();
        break;
    }
  }

  private moveActive(delta: number): void {
    const opts = this.options();
    let next = this.activeIndex() + delta;
    while (next >= 0 && next < opts.length && opts[next].disabled) {
      next += delta;
    }
    if (next >= 0 && next < opts.length) {
      this.activeIndex.set(next);
      this.scrollActiveIntoView();
    }
  }

  private scrollActiveIntoView(): void {
    const listbox = this.listboxRef()?.nativeElement;
    if (!listbox) return;
    const active = listbox.querySelector<HTMLElement>('[aria-selected="true"], .ds-select__option--active');
    active?.scrollIntoView({ block: 'nearest' });
  }

  // ControlValueAccessor
  writeValue(val: string): void { this.selectedValue.set(val ?? null); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(): void {}
}
