import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { PaginationItem, PaginationSize } from './pagination.types';

/**
 * Builds a truncated page list: first page, last page, the current page and
 * its siblings, with an ellipsis marker filling any gap in between.
 *
 * Based on the well-known "range with siblings" truncation pattern used by
 * most pagination UIs (e.g. first … c-1 c c+1 … last).
 */
function buildPageItems(current: number, total: number, siblingCount: number): PaginationItem[] {
  const totalSlots = siblingCount * 2 + 5; // first + last + current + 2*siblings + 2 ellipses

  if (total <= totalSlots) {
    return Array.from({ length: total }, (_, i) => ({ type: 'page', page: i + 1 }));
  }

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, total);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  const page = (n: number): PaginationItem => ({ type: 'page', page: n });
  const range = (start: number, end: number): PaginationItem[] =>
    Array.from({ length: end - start + 1 }, (_, i) => page(start + i));

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + siblingCount * 2;
    return [...range(1, leftItemCount), { type: 'ellipsis', key: 'end' }, page(total)];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + siblingCount * 2;
    return [page(1), { type: 'ellipsis', key: 'start' }, ...range(total - rightItemCount + 1, total)];
  }

  return [
    page(1),
    { type: 'ellipsis', key: 'start' },
    ...range(leftSibling, rightSibling),
    { type: 'ellipsis', key: 'end' },
    page(total),
  ];
}

@Component({
  selector: 'ds-pagination',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  currentPage  = input(1);
  totalPages   = input(1);
  siblingCount = input(1);
  size         = input<PaginationSize>('md');
  disabled     = input(false);
  ariaLabel    = input('Pagination');

  pageChange = output<number>();

  clampedTotal = computed(() => Math.max(this.totalPages(), 1));

  clampedPage = computed(() =>
    Math.min(Math.max(this.currentPage(), 1), this.clampedTotal()),
  );

  isFirst = computed(() => this.clampedPage() <= 1);
  isLast  = computed(() => this.clampedPage() >= this.clampedTotal());

  items = computed(() =>
    buildPageItems(this.clampedPage(), this.clampedTotal(), Math.max(this.siblingCount(), 0)),
  );

  navClasses = computed(() => [
    'ds-pagination',
    `ds-pagination--${this.size()}`,
  ].join(' '));

  itemClasses(item: Extract<PaginationItem, { type: 'page' }>): string {
    const active = item.page === this.clampedPage();
    return [
      'ds-pagination__item',
      active ? 'ds-pagination__item--active' : '',
    ].filter(Boolean).join(' ');
  }

  goTo(page: number): void {
    if (this.disabled()) return;
    const target = Math.min(Math.max(page, 1), this.clampedTotal());
    if (target === this.clampedPage()) return;
    this.pageChange.emit(target);
  }

  prev(): void {
    if (this.isFirst()) return;
    this.goTo(this.clampedPage() - 1);
  }

  next(): void {
    if (this.isLast()) return;
    this.goTo(this.clampedPage() + 1);
  }

  trackItem(_index: number, item: PaginationItem): string {
    return item.type === 'page' ? `p-${item.page}` : `e-${item.key}`;
  }
}
