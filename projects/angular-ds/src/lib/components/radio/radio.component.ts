import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RadioGroupComponent } from '../radio-group/radio-group.component';

let nextId = 0;

/**
 * `ds-radio` — a single option inside a `ds-radio-group`. Renders a hidden
 * native `<input type="radio">` (sharing the parent group's generated
 * `name`) plus a custom visual dot, following the same hidden-native-input +
 * visual-layer pattern as `ds-checkbox`.
 *
 * A `ds-radio` needs no manual wiring to its group: it picks up its parent
 * via `inject(RadioGroupComponent, { optional: true })` in the constructor —
 * the same convention `ds-checkbox`/`ds-input`/`ds-select` use to pick up
 * `NgControl` — reads the shared `name`/`size`/`disabled` state from it, and
 * reports activation back through `selectValue()`. Because every `ds-radio`
 * in a group shares one native `name`, the browser itself provides correct
 * roving-tabindex and Arrow/Home/End keyboard behavior — nothing here
 * reimplements ARIA radiogroup keyboard handling.
 *
 * `ds-radio` also works standalone (no parent group) for one-off use, though
 * it is intended to be composed inside `ds-radio-group`.
 */
@Component({
  selector: 'ds-radio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
})
export class RadioComponent {
  value    = input.required<string>();
  label    = input('');
  disabled = input(false);

  readonly uid = `ds-radio-${++nextId}`;

  private group = inject(RadioGroupComponent, { optional: true });

  /** Shared native `name` from the parent group; falls back to its own uid when used standalone. */
  groupName = computed(() => this.group?.name ?? this.uid);

  checked = computed(() => (this.group ? this.group.value() === this.value() : false));

  isDisabled = computed(() => this.disabled() || (this.group?.disabled() ?? false));

  size = computed(() => this.group?.size() ?? 'md');

  hostClasses = computed(() => [
    'ds-radio-wrapper',
    `ds-radio-wrapper--${this.size()}`,
    this.isDisabled() ? 'ds-radio-wrapper--disabled' : '',
  ].filter(Boolean).join(' '));

  onInputChange(): void {
    this.group?.selectValue(this.value());
  }

  onBlur(): void {
    this.group?.notifyTouched();
  }
}
