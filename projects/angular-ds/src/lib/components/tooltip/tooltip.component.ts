import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { TooltipPosition } from './tooltip.types';

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

  hostClasses = computed(() => [
    'ds-tooltip-host',
    `ds-tooltip-host--${this.position()}`,
    this.disabled() ? 'ds-tooltip-host--disabled' : '',
  ].filter(Boolean).join(' '));
}
