import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import type { BalanceCardAccent } from './balance-card.types';

@Component({
  selector: 'ds-balance-card',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './balance-card.component.html',
  styleUrl: './balance-card.component.scss',
})
export class BalanceCardComponent {
  label = input('Total Balance');
  amount = input(0);
  currency = input('$');
  trend = input(0);
  icon = input('💳');
  accent = input<BalanceCardAccent>('cyan');
  period = input('vs last month');

  absTrend = computed(() => Math.abs(this.trend()));
  classes = computed(() => `ds-balance ds-balance--${this.accent()}`);
}
