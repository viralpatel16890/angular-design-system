import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { RadioGroupComponent } from './radio-group.component';
import { RadioComponent } from '../radio/radio.component';

const meta: Meta<RadioGroupComponent> = {
  title: 'Components/Radio Group',
  component: RadioGroupComponent,
  tags: ['autodocs'],
  argTypes: {
    size:        { control: 'select', options: ['sm', 'md', 'lg'] },
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
    disabled:    { control: 'boolean' },
    required:    { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<RadioGroupComponent>;

export const Default: Story = {
  args: { label: 'Plan' },
  render: (args) => ({
    moduleMetadata: { imports: [RadioComponent, FormsModule] },
    props: { ...args, plan: 'free' },
    template: `
      <ds-radio-group [label]="label" [(ngModel)]="plan">
        <ds-radio value="free" label="Free" />
        <ds-radio value="pro" label="Pro" />
        <ds-radio value="enterprise" label="Enterprise" />
      </ds-radio-group>`,
  }),
};

export const WithHelperTextAndRequired: Story = {
  render: () => ({
    moduleMetadata: { imports: [RadioComponent, FormsModule] },
    props: { plan: '' },
    template: `
      <ds-radio-group
        label="Billing cycle"
        helperText="You can switch cycles at any time."
        [required]="true"
        [(ngModel)]="plan"
      >
        <ds-radio value="monthly" label="Monthly" />
        <ds-radio value="annual" label="Annual (save 20%)" />
      </ds-radio-group>`,
  }),
};

export const Horizontal: Story = {
  render: () => ({
    moduleMetadata: { imports: [RadioComponent, FormsModule] },
    props: { size: 'md' },
    template: `
      <ds-radio-group label="Size" orientation="horizontal" [(ngModel)]="size">
        <ds-radio value="sm" label="Small" />
        <ds-radio value="md" label="Medium" />
        <ds-radio value="lg" label="Large" />
      </ds-radio-group>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [RadioComponent, FormsModule] },
    props: { a: 'x', b: 'x', c: 'x' },
    template: `
      <div style="display:flex;flex-direction:column;gap:1.5rem">
        <ds-radio-group label="Small" size="sm" [(ngModel)]="a">
          <ds-radio value="x" label="Option X" />
          <ds-radio value="y" label="Option Y" />
        </ds-radio-group>
        <ds-radio-group label="Medium" size="md" [(ngModel)]="b">
          <ds-radio value="x" label="Option X" />
          <ds-radio value="y" label="Option Y" />
        </ds-radio-group>
        <ds-radio-group label="Large" size="lg" [(ngModel)]="c">
          <ds-radio value="x" label="Option X" />
          <ds-radio value="y" label="Option Y" />
        </ds-radio-group>
      </div>`,
  }),
};

export const DisabledStates: Story = {
  render: () => ({
    moduleMetadata: { imports: [RadioComponent, FormsModule] },
    props: { groupValue: 'a', itemValue: 'a' },
    template: `
      <div style="display:flex;flex-direction:column;gap:1.5rem">
        <ds-radio-group label="Disabled group" [disabled]="true" [(ngModel)]="groupValue">
          <ds-radio value="a" label="Option A" />
          <ds-radio value="b" label="Option B" />
        </ds-radio-group>
        <ds-radio-group label="One disabled item" [(ngModel)]="itemValue">
          <ds-radio value="a" label="Option A" />
          <ds-radio value="b" label="Option B (disabled)" [disabled]="true" />
        </ds-radio-group>
      </div>`,
  }),
};
