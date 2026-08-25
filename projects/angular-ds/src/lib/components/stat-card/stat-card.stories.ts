import type { Meta, StoryObj } from '@storybook/angular';
import { StatCardComponent } from './stat-card.component';

const meta: Meta<StatCardComponent> = {
  title: 'Components/Stat Card',
  component: StatCardComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'number' },
    trend: { control: 'number' },
    compact: { control: 'boolean' },
    decimals: { control: 'number' },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
    icon: { control: 'text' },
    accent: { control: 'select', options: ['neutral', 'cyan', 'violet', 'amber'] },
    caption: { control: 'text' },
  },
  args: {
    label: 'Metric',
    value: 0,
    compact: false,
    decimals: 2,
    prefix: '',
    suffix: '',
    icon: '📊',
    accent: 'neutral',
    caption: '',
  },
};
export default meta;
type Story = StoryObj<StatCardComponent>;

export const Default: Story = {
  args: {
    label: 'Total Balance',
    value: 48213.92,
    trend: 2.4,
    prefix: '$',
    icon: '💳',
    accent: 'violet',
    caption: 'vs last week',
  },
};

export const Currency: Story = {
  name: 'Currency amount (former Balance Card use case)',
  render: () => ({
    template: `
      <div style="display:flex;gap:1rem;flex-wrap:wrap">
        <ds-stat-card label="Total Balance" [value]="48213.92" [trend]="2.4" prefix="$" icon="💳" accent="cyan" caption="vs last month" />
        <ds-stat-card label="Trading Account" [value]="128940.13" [trend]="-1.8" prefix="$" icon="📈" accent="violet" caption="vs last week" />
        <ds-stat-card label="Savings" [value]="9042.5" [trend]="0.6" prefix="$" icon="🏦" accent="amber" caption="vs last month" />
      </div>`,
  }),
};

export const CompactCount: Story = {
  name: 'Compact count (former Metric Card use case)',
  render: () => ({
    template: `
      <div style="display:flex;gap:1rem;flex-wrap:wrap">
        <ds-stat-card label="Active Users" [value]="128400" [trend]="3.2" [compact]="true" icon="👥" />
        <ds-stat-card label="Page Views" [value]="2540000" [trend]="12.1" [compact]="true" icon="📊" />
        <ds-stat-card label="Signups" [value]="842" [trend]="-4.5" [compact]="true" icon="✍️" suffix="/wk" />
      </div>`,
  }),
};

export const Accents: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:1rem;flex-wrap:wrap">
        <ds-stat-card label="Neutral" [value]="1024" [compact]="true" accent="neutral" />
        <ds-stat-card label="Cyan" [value]="1024" [compact]="true" accent="cyan" />
        <ds-stat-card label="Violet" [value]="1024" [compact]="true" accent="violet" />
        <ds-stat-card label="Amber" [value]="1024" [compact]="true" accent="amber" />
      </div>`,
  }),
};

export const NoTrend: Story = {
  name: 'Without a trend (comparison omitted)',
  args: {
    label: 'Total Members',
    value: 5023,
    compact: true,
    icon: '👤',
  },
};
