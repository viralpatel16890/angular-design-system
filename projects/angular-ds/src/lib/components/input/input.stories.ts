import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { InputComponent } from './input.component';

const meta: Meta<InputComponent> = {
  title: 'Components/Input',
  component: InputComponent,
  tags: ['autodocs'],
  argTypes: {
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    status:   { control: 'select', options: ['default', 'error', 'success', 'warning'] },
    type:     { control: 'select', options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'] },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<InputComponent>;

export const Default: Story = {
  args: { label: 'Email', placeholder: 'you@example.com' },
  render: (args) => ({
    moduleMetadata: { imports: [FormsModule] },
    props: args,
    template: `<ds-input [label]="label" [placeholder]="placeholder" [size]="size" [status]="status" [disabled]="disabled" />`,
  }),
};

export const WithHelperText: Story = {
  args: { label: 'Password', type: 'password', helperText: 'Must be at least 8 characters.' },
  render: (args) => ({
    props: args,
    template: `<ds-input [label]="label" [type]="type" [helperText]="helperText" />`,
  }),
};

export const Error: Story = {
  args: { label: 'Email', status: 'error', helperText: 'Invalid email address.' },
  render: (args) => ({
    props: args,
    template: `<ds-input label="Email" status="error" helperText="Invalid email address." />`,
  }),
};

export const Disabled: Story = {
  args: { label: 'Username', disabled: true },
  render: () => ({
    template: `<ds-input label="Username" [disabled]="true" />`,
  }),
};
