import type { Meta, StoryObj } from '@storybook/angular';
import { SkipLinkComponent } from './skip-link.component';

const meta: Meta<SkipLinkComponent> = {
  title: 'Components/SkipLink',
  component: SkipLinkComponent,
  tags: ['autodocs'],
  argTypes: {
    targetId: { control: 'text' },
    label: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A visually-hidden link that becomes visible on keyboard focus, letting keyboard and screen-reader users jump straight past repeated navigation to the main content landmark. Place it as the very first focusable element in the page, and give the main content landmark a matching `id` (with `tabindex="-1"` so it can receive focus).',
      },
    },
  },
};
export default meta;
type Story = StoryObj<SkipLinkComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="padding: 2rem; font-family: sans-serif;">
        <p>Press <kbd>Tab</kbd> to focus the skip link — it is hidden until then.</p>
        <ds-skip-link />
        <nav style="margin-top: 1rem;">Primary navigation…</nav>
        <main id="main-content" tabindex="-1" style="margin-top: 1rem;">Main content</main>
      </div>`,
  }),
};

export const CustomLabelAndTarget: Story = {
  render: () => ({
    template: `
      <div style="padding: 2rem; font-family: sans-serif;">
        <p>Press <kbd>Tab</kbd> to focus the skip link — it is hidden until then.</p>
        <ds-skip-link targetId="primary-content" label="Skip to primary content" />
        <nav style="margin-top: 1rem;">Primary navigation…</nav>
        <main id="primary-content" tabindex="-1" style="margin-top: 1rem;">Main content</main>
      </div>`,
  }),
};
