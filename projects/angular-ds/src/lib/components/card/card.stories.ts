import type { Meta, StoryObj } from '@storybook/angular';
import { CardComponent } from './card.component';
import { CardHeaderComponent } from './card-header.component';
import { CardBodyComponent } from './card-body.component';
import { CardFooterComponent } from './card-footer.component';
import { ButtonComponent } from '../button/button.component';

const meta: Meta<CardComponent> = {
  title: 'Components/Card',
  component: CardComponent,
  tags: ['autodocs'],
  argTypes: {
    variant:     { control: 'select', options: ['elevated', 'outlined', 'filled'] },
    padding:     { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    interactive: { control: 'boolean' },
    fullHeight:  { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<CardComponent>;

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [CardHeaderComponent, CardBodyComponent, CardFooterComponent, ButtonComponent] },
    template: `
      <ds-card style="max-width:380px">
        <ds-card-header>
          <span slot="title" style="font-weight:600;font-size:var(--font-size-lg)">Card Title</span>
        </ds-card-header>
        <ds-card-body>
          <p style="margin:0;color:var(--color-text-secondary)">This is the card body content.</p>
        </ds-card-body>
        <ds-card-footer>
          <ds-button variant="ghost" size="sm">Cancel</ds-button>
          <ds-button variant="primary" size="sm">Confirm</ds-button>
        </ds-card-footer>
      </ds-card>`,
  }),
};

export const Outlined: Story = {
  render: () => ({
    moduleMetadata: { imports: [CardHeaderComponent, CardBodyComponent] },
    template: `
      <ds-card variant="outlined" style="max-width:380px">
        <ds-card-header>
          <span slot="title" style="font-weight:600;font-size:var(--font-size-lg)">Outlined Card</span>
        </ds-card-header>
        <ds-card-body>Border-only variant with no shadow.</ds-card-body>
      </ds-card>`,
  }),
};

export const Elevated: Story = {
  render: () => ({
    moduleMetadata: { imports: [CardHeaderComponent, CardBodyComponent] },
    template: `
      <ds-card variant="elevated" style="max-width:380px">
        <ds-card-header>
          <span slot="title" style="font-weight:600;font-size:var(--font-size-lg)">Elevated Card</span>
        </ds-card-header>
        <ds-card-body>Elevated shadow variant.</ds-card-body>
      </ds-card>`,
  }),
};

export const Interactive: Story = {
  render: () => ({
    moduleMetadata: { imports: [CardBodyComponent] },
    template: `
      <ds-card [interactive]="true" style="max-width:380px;cursor:pointer">
        <ds-card-body>Hover to see the interactive lift effect.</ds-card-body>
      </ds-card>`,
  }),
};
