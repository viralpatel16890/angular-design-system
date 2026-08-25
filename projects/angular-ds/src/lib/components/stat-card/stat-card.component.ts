import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import type { StatCardAccent } from './stat-card.types';

/**
 * Unified "label + big number + trend indicator" stat card.
 *
 * Consolidates the former `BalanceCardComponent` (currency-style values via
 * `prefix`/`decimals`) and `MetricCardComponent` (compact K/M-abbreviated
 * counts via `compact`) into a single component with one shared formatting
 * mechanism and one typography scale, so both use cases render with
 * consistent visual hierarchy.
 */
@Component({
  selector: 'ds-stat-card',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  /** Card heading text. */
  label = input('Metric');
  /** Raw numeric value; formatted per `compact`/`decimals`. */
  value = input(0);
  /**
   * Percentage change. Omit to hide the trend indicator entirely (e.g. a
   * plain count with nothing to compare against); pass a number (0 included)
   * to show the ▲/▼ indicator.
   */
  trend = input<number | undefined>(undefined);
  /**
   * When `true`, formats `value` with K/M abbreviations above 1,000/1,000,000
   * (former metric-card behavior: counts, plain numbers). When `false`
   * (default), formats with thousands separators and `decimals` fraction
   * digits (former balance-card behavior: currency amounts).
   */
  compact = input(false);
  /** Fraction digits used in non-compact (decimal) formatting. */
  decimals = input(2);
  /** Text prepended to the formatted value, e.g. `'$'` for currency. */
  prefix = input('');
  /** Text appended to the formatted value, e.g. `'%'` or a unit. */
  suffix = input('');
  /** Emoji/character shown in the card header. */
  icon = input('📊');
  /** Accent color for the value and active trend styling. */
  accent = input<StatCardAccent>('neutral');
  /** Optional caption shown next to the trend indicator, e.g. `'vs last month'`. */
  caption = input('');

  classes = computed(() => `ds-stat ds-stat--${this.accent()}`);

  hasTrend = computed(() => this.trend() !== undefined);
  trendValue = computed(() => this.trend() ?? 0);
  absTrend = computed(() => Math.abs(this.trendValue()));

  formattedValue = computed(() => {
    const v = this.value();
    if (this.compact()) {
      const abs = Math.abs(v);
      if (abs >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
      if (abs >= 1_000) return (v / 1_000).toFixed(1) + 'K';
      return v.toFixed(0);
    }
    const digits = this.decimals();
    return v.toLocaleString('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  });
}
