import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from './checkbox.component';

const meta: Meta<CheckboxComponent> = {
  title: 'Components/Checkbox',
  component: CheckboxComponent,
  tags: ['autodocs'],
  argTypes: {
    size:          { control: 'select', options: ['sm', 'md', 'lg'] },
    labelPosition: { control: 'select', options: ['left', 'right'] },
    disabled:      { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    checked:       { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<CheckboxComponent>;

export const Default: Story = {
  args: { label: 'Accept terms and conditions' },
  render: (args) => ({
    moduleMetadata: { imports: [FormsModule] },
    props: { ...args, value: false },
    template: `<ds-checkbox [label]="label" [(ngModel)]="value" [disabled]="disabled" />`,
  }),
};

export const Indeterminate: Story = {
  render: () => ({
    template: `<ds-checkbox label="Select all" [indeterminate]="true" />`,
  }),
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:.75rem">
        <ds-checkbox label="Unchecked" />
        <ds-checkbox label="Checked" [checked]="true" />
        <ds-checkbox label="Indeterminate" [indeterminate]="true" />
        <ds-checkbox label="Disabled (off)" [disabled]="true" />
        <ds-checkbox label="Disabled (on)"  [disabled]="true" [checked]="true" />
      </div>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:.75rem">
        <ds-checkbox size="sm" label="Small checkbox"  [checked]="true" />
        <ds-checkbox size="md" label="Medium checkbox" [checked]="true" />
        <ds-checkbox size="lg" label="Large checkbox"  [checked]="true" />
      </div>`,
  }),
};

export const LabelLeft: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:.75rem">
        <ds-checkbox label="Label on the left" labelPosition="left" />
        <ds-checkbox label="Label on the left (checked)" labelPosition="left" [checked]="true" />
      </div>`,
  }),
};
