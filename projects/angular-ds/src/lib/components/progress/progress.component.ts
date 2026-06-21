import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ProgressVariant, ProgressSize } from './progress.types';

@Component({
  selector: 'ds-progress',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
})
export class ProgressComponent {
  value     = input(0);
  max       = input(100);
  variant   = input<ProgressVariant>('default');
  size      = input<ProgressSize>('md');
  label     = input('');
  showValue = input(false);
  striped   = input(false);
  animated  = input(false);

  clampedValue = computed(() => Math.min(Math.max(this.value(), 0), this.max()));

  percent = computed(() => Math.round((this.clampedValue() / this.max()) * 100));

  trackClasses = computed(() => [
    'ds-progress__track',
    `ds-progress__track--${this.size()}`,
  ].join(' '));

  fillClasses = computed(() => [
    'ds-progress__fill',
    `ds-progress__fill--${this.variant()}`,
    this.striped()  ? 'ds-progress__fill--striped'  : '',
    this.animated() ? 'ds-progress__fill--animated' : '',
  ].filter(Boolean).join(' '));
}
