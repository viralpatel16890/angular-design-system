import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { ToggleComponent } from './toggle.component';

const meta: Meta<ToggleComponent> = {
  title: 'Components/Toggle',
  component: ToggleComponent,
  tags: ['autodocs'],
  argTypes: {
    size:          { control: 'select', options: ['sm', 'md', 'lg'] },
    labelPosition: { control: 'select', options: ['left', 'right'] },
    disabled:      { control: 'boolean' },
    checked:       { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<ToggleComponent>;

export const Default: Story = {
  args: { label: 'Enable notifications' },
  render: (args) => ({
    moduleMetadata: { imports: [FormsModule] },
    props: { ...args, value: false },
    template: `<ds-toggle [label]="label" [(ngModel)]="value" [size]="size" [disabled]="disabled" />`,
  }),
};

export const WithHelperText: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:.75rem">
        <ds-toggle label="Dark mode"       helperText="Applies to all pages." />
        <ds-toggle label="Auto-save"       helperText="Saves every 30 seconds." [checked]="true" />
        <ds-toggle label="Marketing email" helperText="Receive product updates." [disabled]="true" />
      </div>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:.75rem">
        <ds-toggle size="sm" label="Small"  [checked]="true" />
        <ds-toggle size="md" label="Medium" [checked]="true" />
        <ds-toggle size="lg" label="Large"  [checked]="true" />
      </div>`,
  }),
};

export const LabelLeft: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:.75rem">
        <ds-toggle label="Label on the left" labelPosition="left" />
        <ds-toggle label="Label on the left (on)" labelPosition="left" [checked]="true" />
      </div>`,
  }),
};
