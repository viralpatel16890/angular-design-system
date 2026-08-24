import type { FeedbackVariant } from '../../types/feedback-variant';

export type ToastVariant = FeedbackVariant;
export type ToastPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';

export interface Toast {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  duration: number;
  dismissible: boolean;
  removing?: boolean;
}

export interface ToastOptions {
  variant?: ToastVariant;
  title?: string;
  duration?: number;
  dismissible?: boolean;
}
