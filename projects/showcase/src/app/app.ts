import { Component, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../angular-ds/src/lib/components/button/button.component';
import { InputComponent } from '../../../angular-ds/src/lib/components/input/input.component';
import { CardComponent } from '../../../angular-ds/src/lib/components/card/card.component';
import { CardHeaderComponent } from '../../../angular-ds/src/lib/components/card/card-header.component';
import { CardBodyComponent } from '../../../angular-ds/src/lib/components/card/card-body.component';
import { CardFooterComponent } from '../../../angular-ds/src/lib/components/card/card-footer.component';
import { ModalComponent } from '../../../angular-ds/src/lib/components/modal/modal.component';
import { BadgeComponent } from '../../../angular-ds/src/lib/components/badge/badge.component';
import { SelectComponent } from '../../../angular-ds/src/lib/components/select/select.component';
import { ToastContainerComponent } from '../../../angular-ds/src/lib/components/toast/toast-container.component';
import { ToastService } from '../../../angular-ds/src/lib/components/toast/toast.service';
import { NavbarComponent } from '../../../angular-ds/src/lib/components/navbar/navbar.component';
import { CheckboxComponent } from '../../../angular-ds/src/lib/components/checkbox/checkbox.component';
import { ToggleComponent } from '../../../angular-ds/src/lib/components/toggle/toggle.component';
import { SidebarComponent } from '../../../angular-ds/src/lib/components/sidebar/sidebar.component';
import { TabsComponent } from '../../../angular-ds/src/lib/components/tabs/tabs.component';
import { AccordionComponent } from '../../../angular-ds/src/lib/components/accordion/accordion.component';
import { AvatarComponent } from '../../../angular-ds/src/lib/components/avatar/avatar.component';
import { TooltipComponent } from '../../../angular-ds/src/lib/components/tooltip/tooltip.component';
import { ProgressComponent } from '../../../angular-ds/src/lib/components/progress/progress.component';
import type { SelectOption } from '../../../angular-ds/src/lib/components/select/select.types';
import type { NavItem } from '../../../angular-ds/src/lib/components/navbar/navbar.types';
import type { SidebarGroup, SidebarItem } from '../../../angular-ds/src/lib/components/sidebar/sidebar.types';
import type { TabItem } from '../../../angular-ds/src/lib/components/tabs/tabs.types';
import type { AccordionItem } from '../../../angular-ds/src/lib/components/accordion/accordion.types';
import { ThemeCustomizerComponent } from './theme-customizer/theme-customizer.component';

// Inline SVG icons for sidebar items
const ICON = {
  dashboard: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/></svg>`,
  users:     `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="5" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M1 13c0-2.761 2.239-5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="5" r="2" stroke="currentColor" stroke-width="1.5"/><path d="M10 13c0-2.209 1.343-4 3-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  settings:  `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  chart:     `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 11l4-4 3 3 4-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 15h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  inbox:     `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 10h3l1.5 2h5L12 10h3V3a1 1 0 00-1-1H2a1 1 0 00-1 1v7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  docs:      `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 1h7l3 3v11H3V1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 1v3h3M5 7h6M5 10h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  billing:   `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="3" width="14" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M1 6h14" stroke="currentColor" stroke-width="1.5"/><path d="M4 10h2M9 10h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  help:      `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M6 6a2 2 0 114 0c0 1-1 1.5-2 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="12" r=".75" fill="currentColor"/></svg>`,
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardFooterComponent,
    ModalComponent,
    BadgeComponent,
    SelectComponent,
    ToastContainerComponent,
    NavbarComponent,
    SidebarComponent,
    TabsComponent,
    AccordionComponent,
    AvatarComponent,
    TooltipComponent,
    ProgressComponent,
    TitleCasePipe,
    CheckboxComponent,
    ToggleComponent,
    FormsModule,
    ThemeCustomizerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly Math = Math;
  private toast = inject(ToastService);

  modalOpen   = signal(false);
  isDark      = signal(false);

  // ─── Navbar demo ─────────────────────────────────────────────────────────
  navItems: NavItem[] = [
    { label: 'Dashboard', active: true },
    { label: 'Projects' },
    { label: 'Team' },
    { label: 'Reports' },
    { label: 'Settings' },
  ];

  navItemsWithBadge: NavItem[] = [
    { label: 'Home',     active: true },
    { label: 'Inbox',    badge: 4 },
    { label: 'Docs' },
    { label: 'API',      badge: 'New' },
    { label: 'Legacy',   disabled: true },
  ];

  // ─── Sidebar demo ─────────────────────────────────────────────────────────
  sidebarCollapsed  = signal(false);
  sidebarMobileOpen = signal(false);
  activeSidebarId   = signal('dashboard');

  // Checkbox demo state
  cbBasic       = signal(false);
  cbIndeterminate = signal(false);
  cbTerms       = signal(false);
  cbNotifications = signal(true);

  // Toggle demo state
  tgNotify      = signal(false);
  tgDarkMode    = signal(false);
  tgAutoSave    = signal(true);
  tgMarketing   = signal(false);

  sidebarGroups: SidebarGroup[] = [
    {
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: ICON.dashboard },
        { id: 'inbox',     label: 'Inbox',     icon: ICON.inbox,    badge: 3 },
        { id: 'analytics', label: 'Analytics', icon: ICON.chart,
          children: [
            { id: 'analytics-overview', label: 'Overview' },
            { id: 'analytics-reports',  label: 'Reports' },
            { id: 'analytics-exports',  label: 'Exports' },
          ],
        },
      ],
    },
    {
      label: 'Manage',
      items: [
        { id: 'users',    label: 'Users',    icon: ICON.users },
        { id: 'docs',     label: 'Docs',     icon: ICON.docs },
        { id: 'billing',  label: 'Billing',  icon: ICON.billing },
      ],
    },
    {
      label: 'System',
      items: [
        { id: 'settings', label: 'Settings', icon: ICON.settings },
        { id: 'help',     label: 'Help',     icon: ICON.help,     disabled: true },
      ],
    },
  ];

  // ─── Tabs demo ────────────────────────────────────────────────────────────
  demoTabs: TabItem[] = [
    { id: 'overview',  label: 'Overview' },
    { id: 'analytics', label: 'Analytics', badge: 'New' },
    { id: 'settings',  label: 'Settings' },
    { id: 'disabled',  label: 'Disabled', disabled: true },
  ];
  activeTab = signal('overview');

  // ─── Accordion demo ───────────────────────────────────────────────────────
  accordionItems: AccordionItem[] = [
    {
      id: 'a1',
      title: 'What is Angular Design System?',
      content: 'A comprehensive, accessible component library built with Angular 22 signals, a 3-tier CSS token architecture, and full dark mode support.',
    },
    {
      id: 'a2',
      title: 'How do I install it?',
      content: 'Install via npm: npm install angular-ds. Then import any standalone component directly into your Angular module or standalone component.',
      expanded: true,
    },
    {
      id: 'a3',
      title: 'Is it accessible?',
      content: 'Yes — all components are WCAG 2.2 AA compliant with proper ARIA roles, keyboard navigation, and screen reader support via Angular CDK.',
    },
    {
      id: 'a4',
      title: 'Disabled item',
      content: 'This item cannot be expanded.',
      disabled: true,
    },
  ];

  // ─── Progress demo ────────────────────────────────────────────────────────
  progressValue = signal(65);

  onSidebarItemClick(item: SidebarItem): void {
    this.activeSidebarId.set(item.id);
    this.toast.info(`Navigated to "${item.label}"`, { duration: 2000 });
  }

  // ─── Select options ───────────────────────────────────────────────────────
  frameworkOptions: SelectOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react',   label: 'React' },
    { value: 'vue',     label: 'Vue' },
    { value: 'svelte',  label: 'Svelte' },
    { value: 'solid',   label: 'SolidJS' },
  ];

  roleOptions: SelectOption[] = [
    { value: 'admin',  label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
    { value: 'guest',  label: 'Guest', disabled: true },
  ];

  sizeOptions: SelectOption[] = [
    { value: 'xs', label: 'Extra Small' },
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
  ];

  toggleTheme(): void {
    const next = !this.isDark();
    // Use View Transitions API when available for smooth animation
    if (!document.startViewTransition) {
      this.applyTheme(next);
      return;
    }
    document.startViewTransition(() => {
      this.applyTheme(next);
    });
  }

  private applyTheme(dark: boolean): void {
    this.isDark.set(dark);
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  fireToast(variant: 'info' | 'success' | 'warning' | 'error'): void {
    const messages: Record<string, { title: string; message: string }> = {
      info:    { title: 'Heads up',      message: 'Your session will expire in 5 minutes.' },
      success: { title: 'Saved!',        message: 'Your changes have been saved successfully.' },
      warning: { title: 'Almost full',   message: 'You are using 90% of your storage quota.' },
      error:   { title: 'Upload failed', message: 'Could not upload file. Please try again.' },
    };
    this.toast[variant](messages[variant].message, { title: messages[variant].title });
  }
}
