import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { AccordionItem } from './accordion.types';

let nextId = 0;

@Component({
  selector: 'ds-accordion',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
})
export class AccordionComponent {
  items    = input.required<AccordionItem[]>();
  multiple = input(false);
  bordered = input(true);

  itemToggle = output<{ id: string; expanded: boolean }>();

  readonly uid = `ds-accordion-${++nextId}`;

  expandedIds = signal<Set<string>>(new Set());

  ngOnInit(): void {
    const pre = this.items()
      .filter(i => i.expanded)
      .map(i => i.id);
    this.expandedIds.set(new Set(pre));
  }

  isExpanded(item: AccordionItem): boolean {
    return this.expandedIds().has(item.id);
  }

  toggle(item: AccordionItem): void {
    if (item.disabled) return;
    this.expandedIds.update(set => {
      const next = new Set(set);
      if (next.has(item.id)) {
        next.delete(item.id);
        this.itemToggle.emit({ id: item.id, expanded: false });
      } else {
        if (!this.multiple()) next.clear();
        next.add(item.id);
        this.itemToggle.emit({ id: item.id, expanded: true });
      }
      return next;
    });
  }

  triggerId(id: string): string { return `${this.uid}-trigger-${id}`; }
  panelId(id: string): string   { return `${this.uid}-panel-${id}`; }

  hostClass = computed(() => [
    'ds-accordion',
    this.bordered() ? 'ds-accordion--bordered' : '',
  ].filter(Boolean).join(' '));
}
