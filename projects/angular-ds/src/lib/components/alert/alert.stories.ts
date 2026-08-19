import type { Meta, StoryObj } from '@storybook/angular';
import { AlertComponent } from './alert.component';

const meta: Meta<AlertComponent> = {
  title: 'Components/Alert',
  component: AlertComponent,
  tags: ['autodocs'],
  argTypes: {
    variant:     { control: 'select', options: ['info', 'success', 'warning', 'danger'] },
    title:       { control: 'text' },
    message:     { control: 'text' },
    dismissible: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<AlertComponent>;

export const Default: Story = {
  args: {
    variant: 'info',
    title: 'Heads up',
    message: 'This is an informational alert with a title and a dismiss button.',
    dismissible: true,
  },
  render: (args) => ({
    props: args,
    template: `<ds-alert [variant]="variant" [title]="title" [message]="message" [dismissible]="dismissible" style="display:block;max-width:32rem" />`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:.75rem;max-width:32rem">
        <ds-alert variant="info" title="Info" message="Your changes have been saved as a draft."></ds-alert>
        <ds-alert variant="success" title="Success" message="Your payment was processed successfully."></ds-alert>
        <ds-alert variant="warning" title="Warning" message="Your subscription expires in 3 days."></ds-alert>
        <ds-alert variant="danger" title="Error" message="We couldn't process your request. Please try again."></ds-alert>
      </div>`,
  }),
};

export const WithoutTitle: Story = {
  render: () => ({
    template: `<ds-alert variant="info" message="A simple message with no title." style="display:block;max-width:32rem" />`,
  }),
};

export const NotDismissible: Story = {
  render: () => ({
    template: `<ds-alert variant="danger" title="Access denied" message="You do not have permission to perform this action." [dismissible]="false" style="display:block;max-width:32rem" />`,
  }),
};
