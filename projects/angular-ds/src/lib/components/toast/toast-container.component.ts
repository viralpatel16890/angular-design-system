import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import type { ToastPosition } from './toast.types';

@Component({
  selector: 'ds-toast-container',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss',
})
export class ToastContainerComponent {
  position = input<ToastPosition>('top-right');

  readonly toastService = inject(ToastService);
  readonly toasts = this.toastService.toasts;

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  trackById(_: number, toast: { id: string }): string {
    return toast.id;
  }

  iconFor(variant: string): string {
    const icons: Record<string, string> = {
      info:    `<path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.25a.75.75 0 110 1.5.75.75 0 010-1.5zM7.25 7h1.5v4.5h-1.5V7z" fill="currentColor"/>`,
      success: `<path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.03 5.47L7.5 10l-2.03-2.03 1.06-1.06L7.5 7.88l3.47-3.47 1.06 1.06z" fill="currentColor"/>`,
      warning: `<path d="M8.87 1.5L15.5 13a1 1 0 01-.87 1.5H1.37A1 1 0 01.5 13L7.13 1.5a1 1 0 011.74 0zM8 5.5v4h-1V5.5h1zm0 5.75a.75.75 0 110 1.5.75.75 0 010-1.5z" fill="currentColor"/>`,
      error:   `<path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-1 4.5h2v4H7v-4zm1 5.75a.75.75 0 110 1.5.75.75 0 010-1.5z" fill="currentColor"/>`,
    };
    return icons[variant] ?? icons['info'];
  }
}
