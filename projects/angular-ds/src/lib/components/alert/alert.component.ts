import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import type { AlertVariant } from './alert.types';

const ICONS: Record<AlertVariant, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  danger: '✕',
};

@Component({
  selector: 'ds-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  variant = input<AlertVariant>('info');
  title = input('');
  message = input('');
  dismissible = input(true);
  dismissed = output<void>();

  visible = signal(true);
  icon = computed(() => ICONS[this.variant()]);
  classes = computed(() => `ds-alert ds-alert--${this.variant()}`);

  dismiss() {
    this.visible.set(false);
    this.dismissed.emit();
  }
}
