import type { Meta, StoryObj } from '@storybook/angular';
import { CryptoTickerComponent } from './crypto-ticker.component';

const meta: Meta<CryptoTickerComponent> = {
  title: 'Fintech/Crypto Ticker',
  component: CryptoTickerComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Once mounted, the ticker simulates small live price movements every ~2.8s and briefly flashes the price on each update — watch it for a few seconds in the canvas to see the flash animation.',
      },
    },
  },
  argTypes: {
    symbol:    { control: 'text' },
    name:      { control: 'text' },
    price:     { control: 'number' },
    change24h: { control: 'number' },
    logo:      { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<CryptoTickerComponent>;

export const PriceUp: Story = {
  args: { symbol: 'BTC', name: 'Bitcoin', price: 67432.18, change24h: 3.42, logo: '₿' },
  render: (args) => ({
    props: args,
    template: `<ds-crypto-ticker [symbol]="symbol" [name]="name" [price]="price" [change24h]="change24h" [logo]="logo" style="max-width:360px;display:block"></ds-crypto-ticker>`,
  }),
};

export const PriceDown: Story = {
  args: { symbol: 'ETH', name: 'Ethereum', price: 3218.55, change24h: -2.14, logo: 'Ξ' },
  render: (args) => ({
    props: args,
    template: `<ds-crypto-ticker [symbol]="symbol" [name]="name" [price]="price" [change24h]="change24h" [logo]="logo" style="max-width:360px;display:block"></ds-crypto-ticker>`,
  }),
};

export const WatchlistGroup: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:.5rem;max-width:360px">
        <ds-crypto-ticker symbol="BTC" name="Bitcoin" [price]="67432.18" [change24h]="3.42" logo="₿"></ds-crypto-ticker>
        <ds-crypto-ticker symbol="ETH" name="Ethereum" [price]="3218.55" [change24h]="-2.14" logo="Ξ"></ds-crypto-ticker>
        <ds-crypto-ticker symbol="SOL" name="Solana" [price]="142.87" [change24h]="6.78" logo="◎"></ds-crypto-ticker>
        <ds-crypto-ticker symbol="DOGE" name="Dogecoin" [price]="0.1284" [change24h]="-1.05" logo="Ð"></ds-crypto-ticker>
      </div>`,
  }),
};
