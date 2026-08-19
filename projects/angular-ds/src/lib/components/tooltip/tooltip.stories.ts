import type { Meta, StoryObj } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';
import { ButtonComponent } from '../button/button.component';

// ds-tooltip only reveals its bubble on hover / keyboard focus (CSS
// :hover / :focus-within on the host) — there is no `open` input to force
// it visible in a static render. These stories are interactive: hover or
// Tab-focus the trigger element in the canvas to reveal the tooltip bubble.

const meta: Meta<TooltipComponent> = {
  title: 'Components/Tooltip',
  component: TooltipComponent,
  tags: ['autodocs'],
  argTypes: {
    text:     { control: 'text' },
    position: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<TooltipComponent>;

export const Default: Story = {
  args: { text: 'This is a tooltip', position: 'top' },
  render: (args) => ({
    moduleMetadata: { imports: [ButtonComponent] },
    props: { ...args },
    template: `
      <div style="padding:3rem;display:flex;flex-direction:column;align-items:center;gap:.5rem">
        <ds-tooltip [text]="text" [position]="position">
          <ds-button variant="secondary">Hover me</ds-button>
        </ds-tooltip>
        <span style="color:var(--color-text-secondary,#64748b);font-size:.875rem">
          Hover or focus the button to reveal the tooltip.
        </span>
      </div>`,
  }),
};

export const AllPositions: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonComponent] },
    template: `
      <div style="padding:4rem;display:flex;gap:3rem;justify-content:center;flex-wrap:wrap">
        <ds-tooltip text="Tooltip on top" position="top">
          <ds-button variant="secondary">Top</ds-button>
        </ds-tooltip>
        <ds-tooltip text="Tooltip on right" position="right">
          <ds-button variant="secondary">Right</ds-button>
        </ds-tooltip>
        <ds-tooltip text="Tooltip on bottom" position="bottom">
          <ds-button variant="secondary">Bottom</ds-button>
        </ds-tooltip>
        <ds-tooltip text="Tooltip on left" position="left">
          <ds-button variant="secondary">Left</ds-button>
        </ds-tooltip>
      </div>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonComponent] },
    template: `
      <div style="padding:3rem;display:flex;flex-direction:column;align-items:center;gap:.5rem">
        <ds-tooltip text="You will not see this" position="top" [disabled]="true">
          <ds-button variant="secondary">Disabled tooltip</ds-button>
        </ds-tooltip>
        <span style="color:var(--color-text-secondary,#64748b);font-size:.875rem">
          The bubble is suppressed while [disabled]="true", even on hover/focus.
        </span>
      </div>`,
  }),
};

export const LongText: Story = {
  render: () => ({
    moduleMetadata: { imports: [ButtonComponent] },
    template: `
      <div style="padding:3rem;display:flex;justify-content:center">
        <ds-tooltip
          text="This is a longer tooltip message that wraps onto multiple lines to demonstrate the max-width constraint."
          position="bottom"
        >
          <ds-button variant="secondary">Hover for long tooltip</ds-button>
        </ds-tooltip>
      </div>`,
  }),
};
