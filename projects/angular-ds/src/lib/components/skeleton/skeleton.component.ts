import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { SkeletonVariant } from './skeleton.types';

@Component({
  selector: 'ds-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
})
export class SkeletonComponent {
  variant   = input<SkeletonVariant>('text');
  width     = input('');
  height    = input('');
  lines     = input(1);
  ariaLabel = input('Loading…');

  classes = computed(() => [
    'ds-skeleton',
    `ds-skeleton--${this.variant()}`,
  ].join(' '));

  /** Multi-line text skeletons render one bar per line; every other variant renders a single shape. */
  isMultiline = computed(() => this.variant() === 'text' && this.lines() > 1);

  lineIndexes = computed(() => Array.from({ length: Math.max(1, Math.trunc(this.lines())) }, (_, i) => i));

  /** The last line of a multi-line text skeleton is shortened to read as a natural paragraph end. */
  lastLineWidth = computed(() => this.width() || '70%');

  isLastLine(index: number): boolean {
    return index === this.lineIndexes().length - 1;
  }
}
