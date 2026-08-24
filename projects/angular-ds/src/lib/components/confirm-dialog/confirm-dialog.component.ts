import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';
import type { ButtonVariant } from '../button/button.types';
import { ConfirmDialogService } from './confirm-dialog.service';

/**
 * Renders the confirmation dialog driven by `ConfirmDialogService`.
 *
 * A thin wrapper around `ds-modal` — it reuses the modal's CDK focus trap,
 * Escape-to-close, backdrop-click, and `aria-labelledby` wiring rather than
 * reimplementing overlay mechanics. Place a single instance near the app
 * root (the same way `ds-toast-container` is placed) and call
 * `ConfirmDialogService.confirm()` from anywhere to open it.
 */
@Component({
  selector: 'ds-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  private confirmDialogService = inject(ConfirmDialogService);

  private request = this.confirmDialogService.request;

  isOpen        = computed(() => this.request() !== null);
  title         = computed(() => this.request()?.title ?? '');
  message       = computed(() => this.request()?.message ?? '');
  confirmLabel  = computed(() => this.request()?.confirmLabel ?? 'Confirm');
  cancelLabel   = computed(() => this.request()?.cancelLabel ?? 'Cancel');

  confirmButtonVariant = computed<ButtonVariant>(() =>
    this.request()?.variant === 'danger' ? 'danger' : 'primary',
  );

  onConfirm(): void {
    this.confirmDialogService.resolve(true);
  }

  onCancel(): void {
    this.confirmDialogService.resolve(false);
  }

  /** Fired by ds-modal on Escape, backdrop click, or the close (×) button. */
  onModalClosed(): void {
    this.confirmDialogService.resolve(false);
  }
}
