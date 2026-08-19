import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FormErrorComponent } from './form-error.component';
import { InputComponent } from '../input/input.component';

const meta: Meta<FormErrorComponent> = {
  title: 'Components/FormError',
  component: FormErrorComponent,
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<FormErrorComponent>;

export const Default: Story = {
  args: { message: 'This field is required.' },
  render: (args) => ({
    props: args,
    template: `<ds-form-error [message]="message" />`,
  }),
};

export const NoMessage: Story = {
  args: { message: '' },
  render: (args) => ({
    props: args,
    template: `<div>No error is rendered when the message is empty:</div><ds-form-error [message]="message" />`,
  }),
};

export const LongMessage: Story = {
  args: { message: 'Password must be at least 8 characters and include a number, an uppercase letter, and a symbol.' },
  render: (args) => ({
    props: args,
    template: `<div style="max-width:20rem"><ds-form-error [message]="message" /></div>`,
  }),
};

export const WithInputField: Story = {
  render: () => ({
    moduleMetadata: { imports: [FormsModule, InputComponent] },
    props: { value: '' },
    template: `
      <div style="max-width:20rem">
        <ds-input label="Email" status="error" [(ngModel)]="value" />
        <ds-form-error message="Please enter a valid email address." />
      </div>`,
  }),
};
