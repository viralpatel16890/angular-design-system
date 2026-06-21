import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { ToastContainerComponent } from './toast-container.component';
import { ToastService } from './toast.service';
import { ButtonComponent } from '../button/button.component';

const meta: Meta<ToastContainerComponent> = {
  title: 'Components/Toast',
  component: ToastContainerComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({ providers: [ToastService] }),
  ],
  argTypes: {
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center'],
    },
  },
};
export default meta;
type Story = StoryObj<ToastContainerComponent>;

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonComponent], providers: [ToastService] },
    props: {
      toastSvc: null as ToastService | null,
    },
    template: `
      <div style="display:flex;gap:.5rem;flex-wrap:wrap">
        <ds-button variant="primary"
          (pressed)="toastSvc?.info('Info: your changes have been saved.')">
          Info
        </ds-button>
        <ds-button variant="secondary"
          (pressed)="toastSvc?.success('Success! Record created.')">
          Success
        </ds-button>
        <ds-button variant="ghost"
          (pressed)="toastSvc?.warning('Warning: approaching rate limit.')">
          Warning
        </ds-button>
        <ds-button variant="danger"
          (pressed)="toastSvc?.error('Error: failed to save changes.')">
          Error
        </ds-button>
      </div>
      <ds-toast-container position="top-right" />`,
  }),
};

export const BottomCenter: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonComponent], providers: [ToastService] },
    props: { toastSvc: null as ToastService | null },
    template: `
      <ds-button variant="primary" (pressed)="toastSvc?.success('Saved to bottom-center!')">
        Show Toast
      </ds-button>
      <ds-toast-container position="bottom-center" />`,
  }),
};
