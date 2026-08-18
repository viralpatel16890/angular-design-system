import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { MenuPlacement } from './menu.types';

let nextId = 0;

/**
 * `ds-menu` — an ARIA "menu button" action menu (kebab menu / context menu).
 *
 * Distinct from `ds-select`: `ds-select` picks a form value from `role="option"`
 * items via `role="listbox"`. `ds-menu` triggers one-off actions from
 * `role="menuitem"` items via `role="menu"` — closer to a right-click context
 * menu than a form control. Consumers compose actions by content-projecting
 * `<ds-menu-item>` children:
 *
 * ```html
 * <ds-menu ariaLabel="Actions for BTC Purchase">
 *   <ds-menu-item (selected)="viewDetails()">View details</ds-menu-item>
 *   <ds-menu-item variant="danger" (selected)="remove()">Delete</ds-menu-item>
 * </ds-menu>
 * ```
 *
 * Keyboard/roving-tabindex behavior follows the same conventions as
 * `ds-select` (open/close, Escape, click-outside) and `ds-tabs` (real DOM
 * focus moves between items via `ArrowUp`/`ArrowDown`/`Home`/`End`, matching
 * the WAI-ARIA "menu button" pattern rather than the combobox pattern).
 */
@Component({
  selector: 'ds-menu',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  /** Accessible name for both the trigger button and the menu panel. */
  ariaLabel = input.required<string>();
  /** Glyph/text rendered in the trigger button. Defaults to a kebab icon. */
  triggerIcon = input('⋮');
  placement = input<MenuPlacement>('bottom-end');
  disabled = input(false);

  readonly uid = `ds-menu-${++nextId}`;
  readonly menuId = `${this.uid}-panel`;

  isOpen = signal(false);

  triggerRef = viewChild<ElementRef<HTMLButtonElement>>('triggerEl');
  panelRef = viewChild<ElementRef<HTMLUListElement>>('panelEl');

  triggerClasses = computed(() => [
    'ds-menu__trigger',
    this.isOpen() ? 'ds-menu__trigger--open' : '',
    this.disabled() ? 'ds-menu__trigger--disabled' : '',
  ].filter(Boolean).join(' '));

  panelClasses = computed(() => [
    'ds-menu__panel',
    `ds-menu__panel--${this.placement()}`,
  ].filter(Boolean).join(' '));

  open(focusTarget: 'first' | 'last' = 'first'): void {
    if (this.disabled() || this.isOpen()) return;
    this.isOpen.set(true);
    setTimeout(() => this.focusItem(focusTarget === 'first' ? 0 : this.getItems().length - 1));
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  private getItems(): HTMLButtonElement[] {
    const panel = this.panelRef()?.nativeElement;
    if (!panel) return [];
    return Array.from(panel.querySelectorAll<HTMLButtonElement>('.ds-menu-item:not(:disabled)'));
  }

  private focusItem(index: number): void {
    const items = this.getItems();
    if (!items.length) return;
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    items.forEach((el, i) => { el.tabIndex = i === clamped ? 0 : -1; });
    items[clamped].focus();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return;
    const el = event.target as HTMLElement;
    if (!el.closest(`#${this.uid}-container`)) this.close();
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        event.preventDefault();
        this.isOpen() ? this.focusItem(0) : this.open('first');
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.isOpen() ? this.focusItem(this.getItems().length - 1) : this.open('last');
        break;
      case 'Escape':
        if (this.isOpen()) { event.preventDefault(); this.close(); }
        break;
    }
  }

  onPanelKeydown(event: KeyboardEvent): void {
    const items = this.getItems();
    if (!items.length) return;
    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusItem(currentIndex < 0 || currentIndex >= items.length - 1 ? 0 : currentIndex + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusItem(currentIndex <= 0 ? items.length - 1 : currentIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        this.focusItem(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusItem(items.length - 1);
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        this.triggerRef()?.nativeElement.focus();
        break;
      case 'Tab':
        this.close();
        break;
    }
  }

  /**
   * Every `ds-menu-item` renders a plain `.ds-menu-item` button and knows
   * nothing about its parent menu — selection is detected here by delegated
   * click, the same way `document:click` above detects outside clicks.
   */
  onPanelClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('.ds-menu-item')) {
      this.close();
      this.triggerRef()?.nativeElement.focus();
    }
  }
}
