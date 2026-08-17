import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { TooltipPosition } from './tooltip.types';

let nextId = 0;

@Component({
  selector: 'ds-tooltip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent {
  text     = input.required<string>();
  position = input<TooltipPosition>('top');
  disabled = input(false);

  readonly uid      = `ds-tooltip-${++nextId}`;
  readonly bubbleId = `${this.uid}-bubble`;

  hostClasses = computed(() => [
    'ds-tooltip-host',
    `ds-tooltip-host--${this.position()}`,
    this.disabled() ? 'ds-tooltip-host--disabled' : '',
  ].filter(Boolean).join(' '));

  // Bubble is only rendered (and thus only linkable) while not disabled — there's no
  // separate show/hide signal, visibility is purely CSS-driven (:hover / :focus-within).
  describedBy = computed(() => (this.disabled() ? null : this.bubbleId));
}
