import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { SpinnerSize } from './spinner.types';

/**
 * Standalone loading indicator primitive.
 *
 * Purely decorative by default (`aria-hidden`) so it can be dropped inside
 * a component that already manages its own `aria-busy` / accessible label
 * (e.g. `ds-button`). Pass `label` to make it self-describing instead
 * (renders a visually-hidden text node and exposes `role="status"`).
 */
@Component({
  selector: 'ds-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  size  = input<SpinnerSize>('md');
  label = input<string | null>(null);

  classes = computed(() => [
    'ds-spinner',
    `ds-spinner--${this.size()}`,
  ].join(' '));
}
