import type { Meta, StoryObj } from '@storybook/angular';
import { NavbarComponent } from './navbar.component';
import type { NavItem } from './navbar.types';

const NAV_ITEMS: NavItem[] = [
  { label: 'Home',     href: '#', active: true },
  { label: 'Products', href: '#' },
  { label: 'Pricing',  href: '#' },
  { label: 'Docs',     href: '#', badge: 'New' },
  { label: 'Legacy',   href: '#', disabled: true },
];

const meta: Meta<NavbarComponent> = {
  title: 'Components/Navbar',
  component: NavbarComponent,
  tags: ['autodocs'],
  argTypes: {
    sticky:   { control: 'boolean' },
    bordered: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<NavbarComponent>;

export const Default: Story = {
  render: () => ({
    props: { items: NAV_ITEMS },
    template: `
      <ds-navbar [items]="items">
        <span style="font-weight:700;font-size:1.125rem;letter-spacing:-0.02em">Angular DS</span>
      </ds-navbar>`,
  }),
};

export const NotSticky: Story = {
  render: () => ({
    props: { items: NAV_ITEMS },
    template: `
      <ds-navbar [items]="items" [sticky]="false" [bordered]="false">
        <span style="font-weight:700">Angular DS</span>
      </ds-navbar>`,
  }),
};
