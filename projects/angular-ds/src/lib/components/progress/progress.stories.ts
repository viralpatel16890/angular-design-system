import type { Meta, StoryObj } from '@storybook/angular';
import { ProgressComponent } from './progress.component';

const meta: Meta<ProgressComponent> = {
  title: 'Components/Progress',
  component: ProgressComponent,
  tags: ['autodocs'],
  argTypes: {
    value:     { control: { type: 'number', min: 0 } },
    max:       { control: { type: 'number', min: 1 } },
    variant:   { control: 'select', options: ['default', 'success', 'warning', 'error'] },
    size:      { control: 'select', options: ['sm', 'md', 'lg'] },
    label:     { control: 'text' },
    showValue: { control: 'boolean' },
    striped:   { control: 'boolean' },
    animated:  { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<ProgressComponent>;

export const Default: Story = {
  args: {
    value: 60,
    max: 100,
    variant: 'default',
    size: 'md',
    label: 'Uploading files…',
    showValue: true,
    striped: false,
    animated: false,
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="width:320px">
        <ds-progress
          [value]="value"
          [max]="max"
          [variant]="variant"
          [size]="size"
          [label]="label"
          [showValue]="showValue"
          [striped]="striped"
          [animated]="animated"
        />
      </div>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;width:320px">
        <ds-progress variant="default" [value]="40" label="Default" [showValue]="true" />
        <ds-progress variant="success" [value]="80" label="Success" [showValue]="true" />
        <ds-progress variant="warning" [value]="55" label="Warning" [showValue]="true" />
        <ds-progress variant="error"   [value]="20" label="Error"   [showValue]="true" />
      </div>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;width:320px">
        <ds-progress size="sm" variant="default" [value]="65" />
        <ds-progress size="md" variant="default" [value]="65" />
        <ds-progress size="lg" variant="default" [value]="65" />
      </div>`,
  }),
};

export const ValueMaxCombinations: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;width:320px">
        <ds-progress variant="default" [value]="3"   [max]="10"  label="3 / 10"   [showValue]="true" />
        <ds-progress variant="success" [value]="150" [max]="200" label="150 / 200" [showValue]="true" />
        <ds-progress variant="warning" [value]="0"   [max]="50"  label="0 / 50"   [showValue]="true" />
        <ds-progress variant="success" [value]="100" [max]="100" label="Complete" [showValue]="true" />
        <ds-progress variant="error"   [value]="120" [max]="100" label="Over max (clamped)" [showValue]="true" />
      </div>`,
  }),
};

export const StripedAndAnimated: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;width:320px">
        <ds-progress variant="default" [value]="45" label="Striped"           [striped]="true" />
        <ds-progress variant="success" [value]="70" label="Animated stripes" [striped]="true" [animated]="true" />
      </div>`,
  }),
};

export const WithoutLabel: Story = {
  render: () => ({
    template: `
      <div style="width:320px">
        <ds-progress variant="default" [value]="30" />
      </div>`,
  }),
};
