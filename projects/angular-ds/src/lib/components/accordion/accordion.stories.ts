import type { Meta, StoryObj } from '@storybook/angular';
import { AccordionComponent } from './accordion.component';
import type { AccordionItem } from './accordion.types';

const meta: Meta<AccordionComponent> = {
  title: 'Components/Accordion',
  component: AccordionComponent,
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean' },
    bordered: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<AccordionComponent>;

const faqItems: AccordionItem[] = [
  {
    id: '1',
    title: 'What is this component library?',
    content: 'A set of accessible, themeable Angular components built with standalone APIs and signals.',
    expanded: true,
  },
  {
    id: '2',
    title: 'How do I install it?',
    content: 'Run npm install @your-org/angular-ds and import the components you need directly.',
  },
  {
    id: '3',
    title: 'Does it support dark mode?',
    content: 'Yes, every component reads from CSS custom properties that can be swapped per theme.',
  },
];

export const Default: Story = {
  args: { items: faqItems, multiple: false, bordered: true },
  render: (args) => ({
    props: args,
    template: `<ds-accordion [items]="items" [multiple]="multiple" [bordered]="bordered" style="display:block;max-width:32rem" />`,
  }),
};

export const MultipleExpand: Story = {
  args: {
    items: [
      { id: '1', title: 'Section one', content: 'Content for section one.', expanded: true },
      { id: '2', title: 'Section two', content: 'Content for section two.', expanded: true },
      { id: '3', title: 'Section three', content: 'Content for section three, collapsed by default.' },
    ],
    multiple: true,
  },
  render: (args) => ({
    props: args,
    template: `<ds-accordion [items]="items" [multiple]="multiple" style="display:block;max-width:32rem" />`,
  }),
};

export const AllCollapsed: Story = {
  args: {
    items: faqItems.map(item => ({ ...item, expanded: false })),
  },
  render: (args) => ({
    props: args,
    template: `<ds-accordion [items]="items" style="display:block;max-width:32rem" />`,
  }),
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      { id: '1', title: 'Available section', content: 'This one can be toggled open and closed.' },
      { id: '2', title: 'Disabled section', content: 'This one cannot be opened.', disabled: true },
      { id: '3', title: 'Another available section', content: 'This one can also be toggled.' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<ds-accordion [items]="items" style="display:block;max-width:32rem" />`,
  }),
};

export const Unbordered: Story = {
  args: { items: faqItems, bordered: false },
  render: (args) => ({
    props: args,
    template: `<ds-accordion [items]="items" [bordered]="bordered" style="display:block;max-width:32rem" />`,
  }),
};
