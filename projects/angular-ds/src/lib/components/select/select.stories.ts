import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from './select.component';

const OPTIONS = [
  { label: 'Angular', value: 'angular' },
  { label: 'React',   value: 'react' },
  { label: 'Vue',     value: 'vue' },
  { label: 'Svelte',  value: 'svelte', disabled: true },
];

const meta: Meta<SelectComponent> = {
  title: 'Components/Select',
  component: SelectComponent,
  tags: ['autodocs'],
  argTypes: {
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    status:   { control: 'select', options: ['default', 'error', 'success', 'warning'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<SelectComponent>;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [FormsModule] },
    props: { options: OPTIONS, selected: '' },
    template: `<ds-select label="Framework" [options]="options" [(ngModel)]="selected" style="width:280px" />`,
  }),
};

export const WithHelperText: Story = {
  render: () => ({
    props: { options: OPTIONS },
    template: `<ds-select label="Framework" [options]="options" helperText="Choose your preferred framework." style="width:280px" />`,
  }),
};

export const ErrorStatus: Story = {
  render: () => ({
    props: { options: OPTIONS },
    template: `<ds-select label="Framework" [options]="options" status="error" helperText="Please select a framework." style="width:280px" />`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    props: { options: OPTIONS },
    template: `<ds-select label="Framework" [options]="options" [disabled]="true" style="width:280px" />`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: { options: OPTIONS },
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem">
        <ds-select label="Small"  [options]="options" size="sm" style="width:280px" />
        <ds-select label="Medium" [options]="options" size="md" style="width:280px" />
        <ds-select label="Large"  [options]="options" size="lg" style="width:280px" />
      </div>`,
  }),
};
