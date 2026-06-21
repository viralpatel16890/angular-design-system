import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  OnChanges,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule, FocusTrapFactory, FocusTrap } from '@angular/cdk/a11y';
import type { ModalSize } from './modal.types';

@Component({
  selector: 'ds-modal',
  standalone: true,
  imports: [CommonModule, A11yModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnChanges, OnDestroy {
  open            = input(false);
  size            = input<ModalSize>('md');
  title           = input('');
  closeOnBackdrop = input(true);
  closeOnEscape   = input(true);
  hideClose       = input(false);

  closed = output<void>();

  dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialogEl');

  private focusTrapFactory = inject(FocusTrapFactory);
  private focusTrap: FocusTrap | null = null;

  dialogClasses = computed(() => [
    'ds-modal',
    `ds-modal--${this.size()}`,
  ].join(' '));

  ngOnChanges(): void {
    const dialog = this.dialogRef()?.nativeElement;
    if (!dialog) return;

    if (this.open()) {
      if (!dialog.open) {
        dialog.showModal();
        document.body.style.overflow = 'hidden';
        // Create focus trap so Tab cycles only within the dialog
        this.focusTrap = this.focusTrapFactory.create(dialog);
        this.focusTrap.focusInitialElementWhenReady();
      }
    } else {
      if (dialog.open) {
        dialog.close();
        document.body.style.overflow = '';
        this.destroyFocusTrap();
      }
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
    this.destroyFocusTrap();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open() && this.closeOnEscape()) {
      this.close();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (!this.closeOnBackdrop()) return;
    const dialog = this.dialogRef()?.nativeElement;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const clickedOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top  ||
      event.clientY > rect.bottom;
    if (clickedOutside) this.close();
  }

  close(): void {
    this.closed.emit();
  }

  private destroyFocusTrap(): void {
    this.focusTrap?.destroy();
    this.focusTrap = null;
  }
}
