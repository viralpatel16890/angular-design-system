import type { Meta, StoryObj } from '@storybook/angular';
import { FormLegendComponent } from './form-legend.component';

const meta: Meta<FormLegendComponent> = {
  title: 'Components/FormLegend',
  component: FormLegendComponent,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<FormLegendComponent>;

export const Default: Story = {
  args: {},
};

export const CustomText: Story = {
  args: {
    text: 'All fields marked with an asterisk (*) must be completed.',
  },
};

export const AboveAForm: Story = {
  render: () => ({
    template: `
      <div style="max-width: 360px; display: flex; flex-direction: column; gap: 1rem;">
        <ds-form-legend />
        <label style="font: 500 0.875rem var(--font-family-sans); color: var(--color-text-primary);">
          Email address *
        </label>
        <input style="height: 2.5rem; border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: 0 0.75rem;" />
        <label style="font: 500 0.875rem var(--font-family-sans); color: var(--color-text-primary);">
          Company (optional)
        </label>
        <input style="height: 2.5rem; border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: 0 0.75rem;" />
      </div>`,
  }),
};
