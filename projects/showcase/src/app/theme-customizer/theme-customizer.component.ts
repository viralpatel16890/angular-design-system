import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  buildTokenMap,
  generateDangerScale,
  generateInfoScale,
  generatePrimaryScale,
  generateSuccessScale,
  generateWarningScale,
} from '../color.utils';

export interface ColorConfig {
  primary: string;
  success: string;
  warning: string;
  danger:  string;
  info:    string;
}

const DEFAULTS: ColorConfig = {
  primary: '#4f46e5',
  success: '#16a34a',
  warning: '#d97706',
  danger:  '#dc2626',
  info:    '#06b6d4',
};

@Component({
  selector: 'app-theme-customizer',
  standalone: true,
  imports: [],
  templateUrl: './theme-customizer.component.html',
  styleUrl: './theme-customizer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeCustomizerComponent {
  private readonly platformId = inject(PLATFORM_ID);

  isOpen = signal(false);
  colors = signal<ColorConfig>({ ...DEFAULTS });

  readonly colorItems = computed(() => {
    const c = this.colors();
    return [
      { key: 'primary' as keyof ColorConfig, label: 'Brand Primary',  value: c.primary, hint: 'Buttons, active tabs, checkboxes' },
      { key: 'success' as keyof ColorConfig, label: 'Success',         value: c.success, hint: 'Confirmations, valid states' },
      { key: 'warning' as keyof ColorConfig, label: 'Warning',         value: c.warning, hint: 'Alerts, caution badges' },
      { key: 'danger'  as keyof ColorConfig, label: 'Danger / Error',  value: c.danger,  hint: 'Errors, destructive actions' },
      { key: 'info'    as keyof ColorConfig, label: 'Info / Accent',   value: c.info,    hint: 'Informational elements' },
    ];
  });

  toggle(): void { this.isOpen.update(v => !v); }
  close(): void  { this.isOpen.set(false); }

  updateColor(key: keyof ColorConfig, value: string): void {
    this.colors.update(c => ({ ...c, [key]: value }));
    this.applyTokens();
  }

  applyTokens(): void {
    if (isPlatformBrowser(this.platformId)) {
      const tokens = buildTokenMap(this.colors());
      const root = document.documentElement;
      for (const [prop, val] of Object.entries(tokens)) {
        root.style.setProperty(prop, val);
      }
    }
  }

  reset(): void {
    this.colors.set({ ...DEFAULTS });
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      const tokenKeys = Object.keys({
        ...generatePrimaryScale(DEFAULTS.primary),
        ...generateSuccessScale(DEFAULTS.success),
        ...generateWarningScale(DEFAULTS.warning),
        ...generateDangerScale(DEFAULTS.danger),
        ...generateInfoScale(DEFAULTS.info),
      });
      for (const prop of tokenKeys) {
        root.style.removeProperty(prop);
      }
    }
  }
}
