import type { Meta, StoryObj } from '@storybook/angular';
import { ModalComponent } from './modal.component';
import { ButtonComponent } from '../button/button.component';

const meta: Meta<ModalComponent> = {
  title: 'Components/Modal',
  component: ModalComponent,
  tags: ['autodocs'],
  argTypes: {
    size:           { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    title:          { control: 'text' },
    closeOnBackdrop: { control: 'boolean' },
    closeOnEscape:   { control: 'boolean' },
    hideClose:       { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<ModalComponent>;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonComponent] },
    props: { isOpen: false },
    template: `
      <ds-button (pressed)="isOpen = true">Open Modal</ds-button>
      <ds-modal [open]="isOpen" title="Example Modal" (closed)="isOpen = false">
        <p>Modal body content goes here. This dialog is fully accessible and traps focus.</p>
        <div style="display:flex;gap:.5rem;justify-content:flex-end;margin-top:1rem">
          <ds-button variant="ghost" (pressed)="isOpen = false">Cancel</ds-button>
          <ds-button variant="primary" (pressed)="isOpen = false">Confirm</ds-button>
        </div>
      </ds-modal>`,
  }),
};

export const Small: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonComponent] },
    props: { isOpen: false },
    template: `
      <ds-button (pressed)="isOpen = true">Open Small Modal</ds-button>
      <ds-modal [open]="isOpen" size="sm" title="Small Modal" (closed)="isOpen = false">
        <p>A compact modal dialog.</p>
        <div style="display:flex;gap:.5rem;justify-content:flex-end;margin-top:1rem">
          <ds-button variant="primary" size="sm" (pressed)="isOpen = false">OK</ds-button>
        </div>
      </ds-modal>`,
  }),
};

export const Large: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonComponent] },
    props: { isOpen: false },
    template: `
      <ds-button (pressed)="isOpen = true">Open Large Modal</ds-button>
      <ds-modal [open]="isOpen" size="lg" title="Large Modal" (closed)="isOpen = false">
        <p>A larger modal with more content space. Useful for forms or detailed information.</p>
        <div style="display:flex;gap:.5rem;justify-content:flex-end;margin-top:1rem">
          <ds-button variant="ghost" (pressed)="isOpen = false">Cancel</ds-button>
          <ds-button variant="primary" (pressed)="isOpen = false">Save</ds-button>
        </div>
      </ds-modal>`,
  }),
};
