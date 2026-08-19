import type { Meta, StoryObj } from '@storybook/angular';
import { BalanceCardComponent } from './balance-card.component';

const meta: Meta<BalanceCardComponent> = {
  title: 'Fintech/Balance Card',
  component: BalanceCardComponent,
  tags: ['autodocs'],
  argTypes: {
    label:    { control: 'text' },
    amount:   { control: 'number' },
    currency: { control: 'text' },
    trend:    { control: 'number' },
    icon:     { control: 'text' },
    accent:   { control: 'select', options: ['cyan', 'violet', 'amber'] },
    period:   { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<BalanceCardComponent>;

export const Default: Story = {
  args: {
    label: 'Total Balance',
    amount: 24582.19,
    currency: '$',
    trend: 3.4,
    icon: '💳',
    accent: 'cyan',
    period: 'vs last month',
  },
  render: (args) => ({
    props: args,
    template: `<ds-balance-card [label]="label" [amount]="amount" [currency]="currency" [trend]="trend" [icon]="icon" [accent]="accent" [period]="period" style="max-width:320px;display:block"></ds-balance-card>`,
  }),
};

export const PositiveTrend: Story = {
  args: {
    label: 'Checking Account',
    amount: 12894.5,
    currency: '$',
    trend: 5.2,
    icon: '💰',
    accent: 'cyan',
    period: 'vs last month',
  },
  render: (args) => ({
    props: args,
    template: `<ds-balance-card [label]="label" [amount]="amount" [currency]="currency" [trend]="trend" [icon]="icon" [accent]="accent" [period]="period" style="max-width:320px;display:block"></ds-balance-card>`,
  }),
};

export const NegativeTrend: Story = {
  args: {
    label: 'Savings Account',
    amount: 8340.77,
    currency: '$',
    trend: -2.8,
    icon: '🏦',
    accent: 'violet',
    period: 'vs last month',
  },
  render: (args) => ({
    props: args,
    template: `<ds-balance-card [label]="label" [amount]="amount" [currency]="currency" [trend]="trend" [icon]="icon" [accent]="accent" [period]="period" style="max-width:320px;display:block"></ds-balance-card>`,
  }),
};

export const AllAccents: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:1rem;flex-wrap:wrap">
        <ds-balance-card label="Total Balance" [amount]="24582.19" [trend]="3.4" accent="cyan" icon="💳" style="max-width:300px;display:block"></ds-balance-card>
        <ds-balance-card label="Investments" [amount]="118340.02" [trend]="12.6" accent="violet" icon="📈" style="max-width:300px;display:block"></ds-balance-card>
        <ds-balance-card label="Credit Card" [amount]="2410.33" [trend]="-4.1" accent="amber" icon="💳" style="max-width:300px;display:block"></ds-balance-card>
      </div>`,
  }),
};
