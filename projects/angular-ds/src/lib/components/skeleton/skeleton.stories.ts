import type { Meta, StoryObj } from '@storybook/angular';
import { SkeletonComponent } from './skeleton.component';

const meta: Meta<SkeletonComponent> = {
  title: 'Components/Skeleton',
  component: SkeletonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['text', 'circle', 'rect'] },
    width:   { control: 'text' },
    height:  { control: 'text' },
    lines:   { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<SkeletonComponent>;

export const Text: Story = {
  args: { variant: 'text' },
  render: (args) => ({
    props: args,
    template: `<div style="max-width: 320px"><ds-skeleton [variant]="variant" [width]="width" [height]="height" [lines]="lines" /></div>`,
  }),
};

export const MultilineText: Story = {
  render: () => ({
    template: `<div style="max-width: 320px"><ds-skeleton variant="text" [lines]="3" /></div>`,
  }),
};

export const Circle: Story = {
  render: () => ({
    template: `<ds-skeleton variant="circle" />`,
  }),
};

export const Rect: Story = {
  render: () => ({
    template: `<ds-skeleton variant="rect" height="140px" />`,
  }),
};

export const CardLoadingPattern: Story = {
  name: 'Composed: card loading state',
  render: () => ({
    template: `
      <div style="display:flex; gap:.75rem; align-items:center; max-width:320px; padding:1rem; border:1px solid var(--color-border-default); border-radius:12px;">
        <ds-skeleton variant="circle" />
        <div style="flex:1; display:flex; flex-direction:column; gap:.5rem;">
          <ds-skeleton variant="text" width="60%" />
          <ds-skeleton variant="text" [lines]="2" />
        </div>
      </div>`,
  }),
};
