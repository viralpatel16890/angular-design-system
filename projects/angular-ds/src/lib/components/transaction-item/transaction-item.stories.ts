import type { Meta, StoryObj } from '@storybook/angular';
import { TransactionItemComponent } from './transaction-item.component';

const meta: Meta<TransactionItemComponent> = {
  title: 'Fintech/Transaction Item',
  component: TransactionItemComponent,
  tags: ['autodocs'],
  argTypes: {
    name:      { control: 'text' },
    category:  { control: 'text' },
    date:      { control: 'text' },
    amount:    { control: 'number' },
    type:      { control: 'select', options: ['credit', 'debit'] },
    status:    { control: 'select', options: ['success', 'pending', 'processing', 'failed', 'cancelled'] },
    avatar:    { control: 'text' },
    clickable: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<TransactionItemComponent>;

export const Default: Story = {
  args: {
    name: 'Whole Foods Market',
    category: 'Groceries',
    date: 'Aug 18, 2026',
    amount: 84.32,
    type: 'debit',
    status: 'success',
    avatar: '🛒',
    clickable: true,
    ariaLabel: 'Transaction: Whole Foods Market, $84.32',
  },
  render: (args) => ({
    props: args,
    template: `<ds-transaction-item [name]="name" [category]="category" [date]="date" [amount]="amount" [type]="type" [status]="status" [avatar]="avatar" [clickable]="clickable" [ariaLabel]="ariaLabel" style="max-width:420px;display:block"></ds-transaction-item>`,
  }),
};

export const CreditDeposit: Story = {
  args: {
    name: 'Payroll Deposit',
    category: 'Income',
    date: 'Aug 15, 2026',
    amount: 4250.0,
    type: 'credit',
    status: 'success',
    avatar: '💼',
    clickable: true,
    ariaLabel: 'Transaction: Payroll Deposit, +$4,250.00',
  },
  render: (args) => ({
    props: args,
    template: `<ds-transaction-item [name]="name" [category]="category" [date]="date" [amount]="amount" [type]="type" [status]="status" [avatar]="avatar" [clickable]="clickable" [ariaLabel]="ariaLabel" style="max-width:420px;display:block"></ds-transaction-item>`,
  }),
};

export const NotClickable: Story = {
  args: {
    name: 'Monthly Statement Fee',
    category: 'Fees',
    date: 'Aug 1, 2026',
    amount: 4.99,
    type: 'debit',
    status: 'success',
    avatar: '📄',
    clickable: false,
    ariaLabel: '',
  },
  render: (args) => ({
    props: args,
    template: `<ds-transaction-item [name]="name" [category]="category" [date]="date" [amount]="amount" [type]="type" [status]="status" [avatar]="avatar" [clickable]="clickable" style="max-width:420px;display:block"></ds-transaction-item>`,
  }),
};

export const AllStatuses: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:.5rem;max-width:420px">
        <ds-transaction-item name="Spotify Premium" category="Subscription" date="Aug 17, 2026" [amount]="10.99" type="debit" status="success" avatar="🎵"></ds-transaction-item>
        <ds-transaction-item name="Wire Transfer to Savings" category="Transfer" date="Aug 16, 2026" [amount]="1200" type="debit" status="processing" avatar="🏦"></ds-transaction-item>
        <ds-transaction-item name="Freelance Invoice #204" category="Income" date="Aug 14, 2026" [amount]="2600" type="credit" status="pending" avatar="🧾"></ds-transaction-item>
        <ds-transaction-item name="Amazon Order #A19-2281" category="Shopping" date="Aug 12, 2026" [amount]="132.47" type="debit" status="failed" avatar="📦"></ds-transaction-item>
        <ds-transaction-item name="Gym Membership" category="Health" date="Aug 10, 2026" [amount]="45" type="debit" status="cancelled" avatar="🏋️"></ds-transaction-item>
      </div>`,
  }),
};
