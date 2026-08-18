import { Injectable, signal } from '@angular/core';
import type { ConfirmDialogOptions, ConfirmDialogRequest } from './confirm-dialog.types';

/**
 * Imperative service for requesting user confirmation before a destructive
 * or otherwise consequential action (delete, discard, cancel-trade, etc.).
 *
 * Mirrors the ToastService pattern: this service owns the reactive state,
 * and a single `<ds-confirm-dialog />` placed once near the app root renders
 * it — composing `ds-modal` for focus-trap / Escape / backdrop behavior.
 *
 * @example
 * const ok = await this.confirmDialog.confirm({
 *   title: 'Discard trade?',
 *   message: 'Your unsaved trade details will be lost.',
 *   confirmLabel: 'Discard',
 *   variant: 'danger',
 * });
 * if (ok) { ... }
 */
@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private _request = signal<ConfirmDialogRequest | null>(null);
  readonly request = this._request.asReadonly();

  private resolver: ((result: boolean) => void) | null = null;

  /**
   * Opens the confirmation dialog and resolves once the user responds.
   * Resolves `true` on confirm, `false` on cancel, backdrop click, Escape,
   * or the close (×) button.
   *
   * Only one confirmation can be pending at a time — requesting a new one
   * while another is open resolves the previous request with `false`
   * before opening the new one, so no caller is left awaiting forever.
   */
  confirm(options: ConfirmDialogOptions): Promise<boolean> {
    this.resolvePending(false);

    return new Promise<boolean>(resolve => {
      this.resolver = resolve;
      this._request.set({
        id: `confirm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel ?? 'Confirm',
        cancelLabel: options.cancelLabel ?? 'Cancel',
        variant: options.variant ?? 'default',
      });
    });
  }

  /** Called by ConfirmDialogComponent when the user responds. */
  resolve(result: boolean): void {
    this._request.set(null);
    this.resolvePending(result);
  }

  private resolvePending(result: boolean): void {
    const resolver = this.resolver;
    this.resolver = null;
    resolver?.(result);
  }
}
