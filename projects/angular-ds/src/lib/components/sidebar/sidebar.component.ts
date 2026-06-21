import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import type { SidebarGroup, SidebarItem } from './sidebar.types';

@Component({
  selector: 'ds-sidebar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private sanitizer = inject(DomSanitizer);

  groups      = input<SidebarGroup[]>([]);
  collapsed   = input(false);
  mobileOpen  = input(false);
  activeId    = input<string | null>(null);

  safeIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  itemClick       = output<SidebarItem>();
  collapsedChange = output<boolean>();
  mobileClose     = output<void>();

  // Track which sub-menus are expanded
  expandedIds = signal<Set<string>>(new Set());

  isActive = (item: SidebarItem): boolean =>
    item.id === this.activeId() || (item.active ?? false);

  isExpanded = (item: SidebarItem): boolean =>
    this.expandedIds().has(item.id);

  hasActiveChild = (item: SidebarItem): boolean =>
    item.children?.some(c => this.isActive(c)) ?? false;

  toggleCollapse(): void {
    this.collapsedChange.emit(!this.collapsed());
  }

  toggleExpand(item: SidebarItem, event: Event): void {
    event.stopPropagation();
    this.expandedIds.update(set => {
      const next = new Set(set);
      next.has(item.id) ? next.delete(item.id) : next.add(item.id);
      return next;
    });
  }

  onItemClick(item: SidebarItem): void {
    if (item.disabled) return;
    if (item.children?.length) {
      this.expandedIds.update(set => {
        const next = new Set(set);
        next.has(item.id) ? next.delete(item.id) : next.add(item.id);
        return next;
      });
      return;
    }
    this.itemClick.emit(item);
    this.mobileClose.emit();
  }

  onChildClick(child: SidebarItem): void {
    if (child.disabled) return;
    this.itemClick.emit(child);
    this.mobileClose.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.mobileOpen()) this.mobileClose.emit();
  }

  onBackdropClick(): void {
    this.mobileClose.emit();
  }
}
