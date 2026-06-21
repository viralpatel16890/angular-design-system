import { Injectable, signal, computed } from '@angular/core';

export interface GdsThemeConfig {
  brandPrimary?:   string;
  brandHover?:     string;
  brandLight?:     string;
  surfaceBase?:    string;
  surfaceSubtle?:  string;
  surfaceRaised?:  string;
  textPrimary?:    string;
  textSecondary?:  string;
  borderDefault?:  string;
  borderStrong?:   string;
  radiusSm?:       string;
  radiusMd?:       string;
  radiusLg?:       string;
  radiusFull?:     string;
  fontFamilySans?: string;
}

const TOKEN_MAP: Record<keyof GdsThemeConfig, string> = {
  brandPrimary:   '--color-brand-primary',
  brandHover:     '--color-brand-hover',
  brandLight:     '--color-brand-light',
  surfaceBase:    '--color-surface-base',
  surfaceSubtle:  '--color-surface-subtle',
  surfaceRaised:  '--color-surface-raised',
  textPrimary:    '--color-text-primary',
  textSecondary:  '--color-text-secondary',
  borderDefault:  '--color-border-default',
  borderStrong:   '--color-border-strong',
  radiusSm:       '--radius-sm',
  radiusMd:       '--radius-md',
  radiusLg:       '--radius-lg',
  radiusFull:     '--radius-full',
  fontFamilySans: '--font-family-sans',
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _config = signal<GdsThemeConfig>({});
  private _isDark  = signal(false);
  private _styleEl: HTMLStyleElement | null = null;

  readonly isDark = this._isDark.asReadonly();

  readonly config = computed(() => this._config());

  /** Apply a partial theme config — merges with current overrides. */
  applyTheme(config: GdsThemeConfig): void {
    this._config.update(c => ({ ...c, ...config }));
    this.writeStyleTag();
  }

  /** Remove all runtime overrides and revert to default tokens. */
  resetTheme(): void {
    this._config.set({});
    if (this._styleEl) {
      this._styleEl.textContent = '';
    }
  }

  /** Toggle dark mode via [data-theme="dark"] on <html>. */
  setDarkMode(dark: boolean): void {
    this._isDark.set(dark);
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  toggleDarkMode(): void {
    this.setDarkMode(!this._isDark());
  }

  private writeStyleTag(): void {
    if (!this._styleEl) {
      this._styleEl = document.createElement('style');
      this._styleEl.setAttribute('id', 'ds-theme-overrides');
      document.head.appendChild(this._styleEl);
    }

    const config = this._config();
    const lines: string[] = [];

    for (const [key, cssVar] of Object.entries(TOKEN_MAP) as [keyof GdsThemeConfig, string][]) {
      const val = config[key];
      if (val !== undefined) {
        lines.push(`  ${cssVar}: ${val};`);
      }
    }

    this._styleEl.textContent = lines.length
      ? `:root {\n${lines.join('\n')}\n}`
      : '';
  }
}
