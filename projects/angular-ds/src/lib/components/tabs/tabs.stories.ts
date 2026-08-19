import type { Meta, StoryObj } from '@storybook/angular';
import { TabsComponent } from './tabs.component';
import type { TabItem } from './tabs.types';

const TABS: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics', badge: 3 },
  { id: 'settings', label: 'Settings' },
  { id: 'archived', label: 'Archived', disabled: true },
];

// ds-tabs renders only the tab list/header — it does not project or render
// panel content itself. Consumers own the panels and swap them based on
// `activeId` / `(tabChange)`, which is what each story below does.

const meta: Meta<TabsComponent> = {
  title: 'Components/Tabs',
  component: TabsComponent,
  tags: ['autodocs'],
  argTypes: {
    activeId:  { control: 'text' },
    variant:   { control: 'select', options: ['line', 'pill'] },
    size:      { control: 'select', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<TabsComponent>;

export const Line: Story = {
  render: () => ({
    props: { tabs: TABS, activeId: 'overview' },
    template: `
      <div style="width:420px">
        <ds-tabs [tabs]="tabs" [activeId]="activeId" variant="line" (tabChange)="activeId = $event" />
        <div style="padding:1rem 0;color:var(--color-text-secondary,#64748b)">
          @if (activeId === 'overview') { <p style="margin:0">Overview panel: a high-level summary of the account.</p> }
          @if (activeId === 'analytics') { <p style="margin:0">Analytics panel: charts and usage metrics.</p> }
          @if (activeId === 'settings') { <p style="margin:0">Settings panel: preferences and configuration.</p> }
        </div>
      </div>`,
  }),
};

export const Pill: Story = {
  render: () => ({
    props: { tabs: TABS, activeId: 'analytics' },
    template: `
      <div style="width:420px">
        <ds-tabs [tabs]="tabs" [activeId]="activeId" variant="pill" (tabChange)="activeId = $event" />
        <div style="padding:1rem 0;color:var(--color-text-secondary,#64748b)">
          @if (activeId === 'overview') { <p style="margin:0">Overview panel: a high-level summary of the account.</p> }
          @if (activeId === 'analytics') { <p style="margin:0">Analytics panel: charts and usage metrics.</p> }
          @if (activeId === 'settings') { <p style="margin:0">Settings panel: preferences and configuration.</p> }
        </div>
      </div>`,
  }),
};

export const FullWidth: Story = {
  render: () => ({
    props: { tabs: TABS, activeId: 'overview' },
    template: `
      <div style="width:480px">
        <ds-tabs [tabs]="tabs" [activeId]="activeId" variant="line" [fullWidth]="true" (tabChange)="activeId = $event" />
      </div>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: { tabs: TABS },
    template: `
      <div style="display:flex;flex-direction:column;gap:1.5rem;width:420px">
        <ds-tabs [tabs]="tabs" activeId="overview" variant="line" size="sm" />
        <ds-tabs [tabs]="tabs" activeId="overview" variant="line" size="md" />
        <ds-tabs [tabs]="tabs" activeId="overview" variant="line" size="lg" />
      </div>`,
  }),
};

export const WithDisabledTab: Story = {
  render: () => ({
    props: { tabs: TABS, activeId: 'overview' },
    template: `
      <div style="width:420px">
        <ds-tabs [tabs]="tabs" [activeId]="activeId" variant="pill" (tabChange)="activeId = $event" />
        <p style="margin:1rem 0 0;color:var(--color-text-secondary,#64748b)">
          The "Archived" tab is disabled and cannot be selected or focused via keyboard navigation.
        </p>
      </div>`,
  }),
};
