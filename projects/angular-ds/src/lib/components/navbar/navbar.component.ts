import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { NavItem } from './navbar.types';

@Component({
  selector: 'ds-navbar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  items    = input<NavItem[]>([]);
  sticky   = input(true);
  bordered = input(true);

  itemClick   = output<NavItem>();
  menuToggled = output<boolean>();

  mobileOpen = signal(false);

  toggleMobile(): void {
    this.mobileOpen.update(v => !v);
    this.menuToggled.emit(this.mobileOpen());
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
    this.menuToggled.emit(false);
  }

  onItemClick(item: NavItem): void {
    if (item.disabled) return;
    this.itemClick.emit(item);
    this.closeMobile();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.mobileOpen()) this.closeMobile();
  }
}
