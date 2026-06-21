import { inject, Injectable, signal } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import type { Toast, ToastOptions, ToastVariant } from './toast.types';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private liveAnnouncer = inject(LiveAnnouncer);

  show(message: string, options: ToastOptions = {}): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const toast: Toast = {
      id,
      message,
      variant:     options.variant     ?? 'info',
      title:       options.title,
      duration:    options.duration     ?? 4000,
      dismissible: options.dismissible  ?? true,
    };

    this._toasts.update(list => [...list, toast]);

    // Announce to screen readers
    const prefix = toast.title ? `${toast.title}: ` : '';
    const politeness = toast.variant === 'error' ? 'assertive' : 'polite';
    this.liveAnnouncer.announce(`${prefix}${message}`, politeness);

    if (toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }

    return id;
  }

  info   (message: string, opts?: Omit<ToastOptions, 'variant'>) { return this.show(message, { ...opts, variant: 'info'    }); }
  success(message: string, opts?: Omit<ToastOptions, 'variant'>) { return this.show(message, { ...opts, variant: 'success' }); }
  warning(message: string, opts?: Omit<ToastOptions, 'variant'>) { return this.show(message, { ...opts, variant: 'warning' }); }
  error  (message: string, opts?: Omit<ToastOptions, 'variant'>) { return this.show(message, { ...opts, variant: 'error'   }); }

  dismiss(id: string): void {
    this._toasts.update(list =>
      list.map(t => t.id === id ? { ...t, removing: true } : t)
    );
    setTimeout(() => {
      this._toasts.update(list => list.filter(t => t.id !== id));
    }, 250);
  }

  clear(): void { this._toasts.set([]); }
}
