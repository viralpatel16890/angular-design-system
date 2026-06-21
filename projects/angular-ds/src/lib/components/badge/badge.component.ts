import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { BadgeVariant, BadgeSize, BadgeShape } from './badge.types';

@Component({
  selector: 'ds-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  variant = input<BadgeVariant>('default');
  size    = input<BadgeSize>('md');
  shape   = input<BadgeShape>('rounded');
  dot     = input(false);

  classes = computed(() => [
    'ds-badge',
    `ds-badge--${this.variant()}`,
    `ds-badge--${this.size()}`,
    `ds-badge--${this.shape()}`,
    this.dot() ? 'ds-badge--dot' : '',
  ].filter(Boolean).join(' '));
}
