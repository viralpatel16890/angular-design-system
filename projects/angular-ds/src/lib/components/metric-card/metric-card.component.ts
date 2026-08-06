import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'ds-metric-card',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss',
})
export class MetricCardComponent {
  label = input('Metric');
  value = input(0);
  change = input(0);
  icon = input('📊');
  prefix = input('');
  suffix = input('');

  formattedValue = computed(() => {
    const v = this.value();
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
    if (v >= 1_000) return (v / 1_000).toFixed(1) + 'K';
    return v.toFixed(0);
  });

  sparkBars = computed(() => {
    const v = this.value();
    const base = [18, 35, 27, 52, 40, 65, 48, 78, 55, 88];
    return base.map((b, i) => Math.min(100, Math.max(8, b + ((v * (i + 1)) % 22) - 11)));
  });
}
