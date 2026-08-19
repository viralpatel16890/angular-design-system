import type { Meta, StoryObj } from '@storybook/angular';
import { AvatarComponent } from './avatar.component';

const meta: Meta<AvatarComponent> = {
  title: 'Components/Avatar',
  component: AvatarComponent,
  tags: ['autodocs'],
  argTypes: {
    src:    { control: 'text' },
    alt:    { control: 'text' },
    name:   { control: 'text' },
    size:   { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape:  { control: 'select', options: ['circle', 'square'] },
    status: { control: 'select', options: ['online', 'offline', 'away', 'busy'] },
    color:  { control: 'select', options: ['violet', 'teal', 'red', 'amber', 'green', 'neutral'] },
  },
};
export default meta;
type Story = StoryObj<AvatarComponent>;

export const Default: Story = {
  args: { name: 'Ada Lovelace', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<ds-avatar [name]="name" [size]="size" [shape]="shape" [status]="status" [color]="color" />`,
  }),
};

export const WithImage: Story = {
  args: { src: 'https://i.pravatar.cc/150?img=12', alt: 'Grace Hopper', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<ds-avatar [src]="src" [alt]="alt" [size]="size" />`,
  }),
};

export const ImageFallsBackToInitials: Story = {
  args: { src: 'https://broken-url.invalid/avatar.jpg', name: 'Katherine Johnson', size: 'md' },
  render: (args) => ({
    props: args,
    template: `<ds-avatar [src]="src" [name]="name" [size]="size" />`,
  }),
};

export const IconFallback: Story = {
  render: () => ({
    template: `<ds-avatar size="md" />`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:1rem;align-items:center">
        <ds-avatar name="Ada Lovelace" size="xs" />
        <ds-avatar name="Ada Lovelace" size="sm" />
        <ds-avatar name="Ada Lovelace" size="md" />
        <ds-avatar name="Ada Lovelace" size="lg" />
        <ds-avatar name="Ada Lovelace" size="xl" />
      </div>`,
  }),
};

export const Shapes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:1rem;align-items:center">
        <ds-avatar name="Ada Lovelace" shape="circle" size="lg" />
        <ds-avatar name="Ada Lovelace" shape="square" size="lg" />
      </div>`,
  }),
};

export const WithStatus: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:1rem;align-items:center">
        <ds-avatar name="Ada Lovelace" size="lg" status="online" />
        <ds-avatar name="Ada Lovelace" size="lg" status="away" />
        <ds-avatar name="Ada Lovelace" size="lg" status="busy" />
        <ds-avatar name="Ada Lovelace" size="lg" status="offline" />
      </div>`,
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:1rem;align-items:center">
        <ds-avatar name="Violet" color="violet" size="lg" />
        <ds-avatar name="Teal" color="teal" size="lg" />
        <ds-avatar name="Red" color="red" size="lg" />
        <ds-avatar name="Amber" color="amber" size="lg" />
        <ds-avatar name="Green" color="green" size="lg" />
        <ds-avatar name="Neutral" color="neutral" size="lg" />
      </div>`,
  }),
};
