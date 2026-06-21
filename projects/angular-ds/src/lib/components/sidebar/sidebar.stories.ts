import type { Meta, StoryObj } from '@storybook/angular';
import { SidebarComponent } from './sidebar.component';
import type { SidebarGroup } from './sidebar.types';

const GROUPS: SidebarGroup[] = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', active: true },
      { id: 'analytics',  label: 'Analytics' },
      { id: 'projects',   label: 'Projects',  badge: '3' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { id: 'profile',  label: 'Profile' },
      { id: 'billing',  label: 'Billing' },
      { id: 'security', label: 'Security', disabled: true },
    ],
  },
];

const meta: Meta<SidebarComponent> = {
  title: 'Components/Sidebar',
  component: SidebarComponent,
  tags: ['autodocs'],
  argTypes: {
    collapsed:  { control: 'boolean' },
    mobileOpen: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<SidebarComponent>;

export const Default: Story = {
  render: () => ({
    props: { groups: GROUPS, collapsed: false },
    template: `
      <div style="height:400px;display:flex;border:1px solid var(--color-border-default,#e2e8f0);border-radius:8px;overflow:hidden">
        <ds-sidebar [groups]="groups" [collapsed]="collapsed" />
        <div style="flex:1;padding:1.5rem;background:var(--color-surface-subtle,#f8fafc)">
          <p style="margin:0;color:var(--color-text-secondary,#64748b)">Page content area</p>
        </div>
      </div>`,
  }),
};

export const Collapsed: Story = {
  render: () => ({
    props: { groups: GROUPS, collapsed: true },
    template: `
      <div style="height:400px;display:flex;border:1px solid var(--color-border-default,#e2e8f0);border-radius:8px;overflow:hidden">
        <ds-sidebar [groups]="groups" [collapsed]="collapsed" />
        <div style="flex:1;padding:1.5rem;background:var(--color-surface-subtle,#f8fafc)">
          <p style="margin:0;color:var(--color-text-secondary,#64748b)">Page content area</p>
        </div>
      </div>`,
  }),
};
