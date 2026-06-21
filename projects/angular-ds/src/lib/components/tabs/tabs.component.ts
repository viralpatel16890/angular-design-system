import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import type { TabItem, TabVariant, TabSize } from './tabs.types';

let nextId = 0;

@Component({
  selector: 'ds-tabs',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  private sanitizer = inject(DomSanitizer);

  tabs     = input.required<TabItem[]>();
  activeId = input<string>('');
  variant  = input<TabVariant>('line');
  size     = input<TabSize>('md');
  fullWidth = input(false);

  tabChange = output<string>();

  readonly uid = `ds-tabs-${++nextId}`;

  private _activeId = signal<string>('');

  tabRefs = viewChildren<ElementRef<HTMLButtonElement>>('tabBtn');

  constructor() {
    // seed active from input
  }

  effectiveActiveId = computed(() => this.activeId() || this._activeId());

  listClasses = computed(() => [
    'ds-tabs__list',
    `ds-tabs__list--${this.variant()}`,
    `ds-tabs__list--${this.size()}`,
    this.fullWidth() ? 'ds-tabs__list--full' : '',
  ].filter(Boolean).join(' '));

  tabClasses(tab: TabItem): string {
    const active = tab.id === this.effectiveActiveId();
    return [
      'ds-tabs__tab',
      `ds-tabs__tab--${this.variant()}`,
      active    ? 'ds-tabs__tab--active'    : '',
      tab.disabled ? 'ds-tabs__tab--disabled' : '',
    ].filter(Boolean).join(' ');
  }

  panelId(tabId: string): string { return `${this.uid}-panel-${tabId}`; }
  tabId(tabId: string): string   { return `${this.uid}-tab-${tabId}`; }

  safeIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  select(tab: TabItem): void {
    if (tab.disabled) return;
    this._activeId.set(tab.id);
    this.tabChange.emit(tab.id);
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    const tabs = this.tabs().filter(t => !t.disabled);
    const currentIdx = tabs.findIndex(t => t.id === this.effectiveActiveId());
    let nextIdx = currentIdx;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIdx = (currentIdx + 1) % tabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        event.preventDefault();
        nextIdx = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIdx = tabs.length - 1;
        break;
      default:
        return;
    }

    const target = tabs[nextIdx];
    this.select(target);
    const allRefs = this.tabRefs();
    const allTabs = this.tabs();
    const refIdx = allTabs.findIndex(t => t.id === target.id);
    allRefs[refIdx]?.nativeElement.focus();
  }
}
