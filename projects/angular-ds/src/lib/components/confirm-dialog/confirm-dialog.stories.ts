import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { Component, inject, signal } from '@angular/core';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmDialogService } from './confirm-dialog.service';
import { ButtonComponent } from '../button/button.component';

/**
 * Small host used only to demo the imperative `ConfirmDialogService` API —
 * consumers call `confirm()` from any component/service, the same way they'd
 * call `ToastService.show()`. Not part of the public library API.
 */
@Component({
  selector: 'ds-confirm-dialog-demo',
  standalone: true,
  imports: [ButtonComponent, ConfirmDialogComponent],
  template: `
    <div style="display:flex;gap:.5rem;flex-wrap:wrap">
      <ds-button variant="secondary" (pressed)="discard()">Discard draft</ds-button>
      <ds-button variant="danger" (pressed)="deleteAccount()">Delete account</ds-button>
    </div>
    <p style="margin-top:.75rem;color:var(--color-text-secondary)">{{ result() }}</p>
    <ds-confirm-dialog />
  `,
})
class ConfirmDialogDemoComponent {
  private confirmDialog = inject(ConfirmDialogService);
  result = signal('');

  async discard() {
    const ok = await this.confirmDialog.confirm({
      title: 'Discard draft?',
      message: 'Your unsaved changes will be lost.',
      confirmLabel: 'Discard',
      cancelLabel: 'Keep editing',
    });
    this.result.set(ok ? 'Draft discarded.' : 'Kept editing.');
  }

  async deleteAccount() {
    const ok = await this.confirmDialog.confirm({
      title: 'Delete account?',
      message: 'This permanently deletes your account and cannot be undone.',
      confirmLabel: 'Delete',
      variant: 'danger',
    });
    this.result.set(ok ? 'Account deleted.' : 'Cancelled.');
  }
}

const meta: Meta<ConfirmDialogDemoComponent> = {
  title: 'Components/Confirm Dialog',
  component: ConfirmDialogDemoComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({ providers: [ConfirmDialogService] }),
  ],
};
export default meta;
type Story = StoryObj<ConfirmDialogDemoComponent>;

/**
 * Two entry points into the same `ds-confirm-dialog`: a default (primary)
 * confirmation and a `variant: 'danger'` one, which renders the confirm
 * button with the danger color tokens (same as `ds-button variant="danger"`
 * and `ds-alert variant="danger"`).
 */
export const Default: Story = {};
