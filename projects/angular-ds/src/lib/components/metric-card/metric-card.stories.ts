import type { Meta, StoryObj } from '@storybook/angular';
import { MetricCardComponent } from './metric-card.component';

const meta: Meta<MetricCardComponent> = {
  title: 'Fintech/Metric Card',
  component: MetricCardComponent,
  tags: ['autodocs'],
  argTypes: {
    label:  { control: 'text' },
    value:  { control: 'number' },
    change: { control: 'number' },
    icon:   { control: 'text' },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<MetricCardComponent>;

export const WithPrefix: Story = {
  args: { label: 'Monthly Revenue', value: 128400, change: 8.3, icon: '💵', prefix: '$', suffix: '' },
  render: (args) => ({
    props: args,
    template: `<ds-metric-card [label]="label" [value]="value" [change]="change" [icon]="icon" [prefix]="prefix" [suffix]="suffix" style="max-width:260px;display:block"></ds-metric-card>`,
  }),
};

export const WithSuffix: Story = {
  args: { label: 'Conversion Rate', value: 4.8, change: -0.6, icon: '🎯', prefix: '', suffix: '%' },
  render: (args) => ({
    props: args,
    template: `<ds-metric-card [label]="label" [value]="value" [change]="change" [icon]="icon" [prefix]="prefix" [suffix]="suffix" style="max-width:260px;display:block"></ds-metric-card>`,
  }),
};

export const NoAffix: Story = {
  args: { label: 'Active Users', value: 48250, change: 12.4, icon: '👥', prefix: '', suffix: '' },
  render: (args) => ({
    props: args,
    template: `<ds-metric-card [label]="label" [value]="value" [change]="change" [icon]="icon" [prefix]="prefix" [suffix]="suffix" style="max-width:260px;display:block"></ds-metric-card>`,
  }),
};

export const NegativeChange: Story = {
  args: { label: 'Churn Rate', value: 2.1, change: -15.7, icon: '📉', prefix: '', suffix: '%' },
  render: (args) => ({
    props: args,
    template: `<ds-metric-card [label]="label" [value]="value" [change]="change" [icon]="icon" [prefix]="prefix" [suffix]="suffix" style="max-width:260px;display:block"></ds-metric-card>`,
  }),
};

export const Dashboard: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;max-width:900px">
        <ds-metric-card label="Monthly Revenue" [value]="128400" [change]="8.3" icon="💵" prefix="$"></ds-metric-card>
        <ds-metric-card label="Conversion Rate" [value]="4.8" [change]="-0.6" icon="🎯" suffix="%"></ds-metric-card>
        <ds-metric-card label="Active Users" [value]="48250" [change]="12.4" icon="👥"></ds-metric-card>
        <ds-metric-card label="Churn Rate" [value]="2.1" [change]="-15.7" icon="📉" suffix="%"></ds-metric-card>
      </div>`,
  }),
};
