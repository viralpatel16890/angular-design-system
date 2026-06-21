import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ButtonVariant, ButtonSize, ButtonType } from './button.types';

@Component({
  selector: 'ds-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  variant  = input<ButtonVariant>('primary');
  size     = input<ButtonSize>('md');
  type     = input<ButtonType>('button');
  disabled = input(false);
  loading  = input(false);
  fullWidth= input(false);
  ariaLabel= input<string | null>(null);

  pressed = output<MouseEvent>();

  classes = computed(() => {
    const base = 'ds-btn';
    return [
      base,
      `${base}--${this.variant()}`,
      `${base}--${this.size()}`,
      this.fullWidth() ? `${base}--full` : '',
      this.loading() ? `${base}--loading` : '',
    ].filter(Boolean).join(' ');
  });

  isDisabled = computed(() => this.disabled() || this.loading());

  onClick(event: MouseEvent): void {
    if (!this.isDisabled()) {
      this.pressed.emit(event);
    }
  }
}
