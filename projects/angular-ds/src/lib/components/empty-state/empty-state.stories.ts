import type { Meta, StoryObj } from '@storybook/angular';
import { EmptyStateComponent } from './empty-state.component';
import { ButtonComponent } from '../button/button.component';

const meta: Meta<EmptyStateComponent> = {
  title: 'Components/EmptyState',
  component: EmptyStateComponent,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<EmptyStateComponent>;

export const Basic: Story = {
  args: {
    title: 'No results found',
    description: 'Try adjusting your filters or search terms.',
  },
  render: (args) => ({
    props: args,
    template: `<ds-empty-state [title]="title" [description]="description" />`,
  }),
};

export const WithIcon: Story = {
  render: () => ({
    template: `
      <ds-empty-state title="No trades yet" description="Your recent trades will show up here once you place an order.">
        <span icon style="font-size:2.5rem">📭</span>
      </ds-empty-state>`,
  }),
};

export const WithIconAndAction: Story = {
  name: 'With icon + action',
  render: () => ({
    moduleMetadata: { imports: [ButtonComponent] },
    template: `
      <ds-empty-state title="No trades yet" description="Your recent trades will show up here once you place an order.">
        <span icon style="font-size:2.5rem">📭</span>
        <ds-button action variant="primary" size="sm">Place a trade</ds-button>
      </ds-empty-state>`,
  }),
};

export const ErrorRetry: Story = {
  name: 'Error state with retry action',
  render: () => ({
    moduleMetadata: { imports: [ButtonComponent] },
    template: `
      <ds-empty-state title="Couldn't load data" description="Something went wrong while fetching your portfolio.">
        <span icon style="font-size:2.5rem">⚠️</span>
        <ds-button action variant="secondary" size="sm">Try again</ds-button>
      </ds-empty-state>`,
  }),
};
