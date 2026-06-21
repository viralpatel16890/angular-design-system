import type { Meta, StoryObj } from '@storybook/angular';
import { BadgeComponent } from './badge.component';

const meta: Meta<BadgeComponent> = {
  title: 'Components/Badge',
  component: BadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'primary', 'success', 'warning', 'danger', 'info'] },
    size:    { control: 'select', options: ['sm', 'md', 'lg'] },
    shape:   { control: 'select', options: ['rounded', 'pill', 'square'] },
    dot:     { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<BadgeComponent>;

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;align-items:center">
        <ds-badge variant="default">Default</ds-badge>
        <ds-badge variant="primary">Primary</ds-badge>
        <ds-badge variant="success">Success</ds-badge>
        <ds-badge variant="warning">Warning</ds-badge>
        <ds-badge variant="danger">Danger</ds-badge>
        <ds-badge variant="info">Info</ds-badge>
      </div>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:.5rem;align-items:center">
        <ds-badge size="sm" variant="primary">Small</ds-badge>
        <ds-badge size="md" variant="primary">Medium</ds-badge>
        <ds-badge size="lg" variant="primary">Large</ds-badge>
      </div>`,
  }),
};

export const WithDot: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;align-items:center">
        <ds-badge variant="success" [dot]="true">Online</ds-badge>
        <ds-badge variant="danger"  [dot]="true">Offline</ds-badge>
        <ds-badge variant="warning" [dot]="true">Away</ds-badge>
      </div>`,
  }),
};

export const Pill: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;align-items:center">
        <ds-badge variant="primary" shape="pill">99+</ds-badge>
        <ds-badge variant="danger"  shape="pill">New</ds-badge>
        <ds-badge variant="success" shape="pill">Active</ds-badge>
      </div>`,
  }),
};
