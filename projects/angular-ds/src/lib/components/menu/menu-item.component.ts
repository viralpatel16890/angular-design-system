import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { MenuItemVariant } from './menu.types';

/**
 * A single actionable entry inside a `<ds-menu>` action-menu panel.
 *
 * `ds-menu-item` is intentionally "dumb" — it renders a native `role="menuitem"`
 * button and emits `selected` on activation. It has no knowledge of its parent
 * `ds-menu`; the parent detects selection/close purely by listening for clicks
 * on elements matching `.ds-menu-item` inside its panel (see menu.component.ts),
 * so items can be composed freely without any DI wiring between the two.
 */
@Component({
  selector: 'ds-menu-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
})
export class MenuItemComponent {
  disabled = input(false);
  variant = input<MenuItemVariant>('default');

  selected = output<void>();

  onClick(): void {
    if (this.disabled()) return;
    this.selected.emit();
  }
}
