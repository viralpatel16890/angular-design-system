import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../angular-ds/src/lib/components/button/button.component';
import { InputComponent } from '../../../angular-ds/src/lib/components/input/input.component';
import { SelectComponent } from '../../../angular-ds/src/lib/components/select/select.component';
import { FormLegendComponent } from '../../../angular-ds/src/lib/components/form-legend/form-legend.component';
import { AlertComponent } from '../../../angular-ds/src/lib/components/alert/alert.component';
import { BadgeComponent } from '../../../angular-ds/src/lib/components/badge/badge.component';
import { StatCardComponent } from '../../../angular-ds/src/lib/components/stat-card/stat-card.component';
import { RadioGroupComponent } from '../../../angular-ds/src/lib/components/radio-group/radio-group.component';
import { RadioComponent } from '../../../angular-ds/src/lib/components/radio/radio.component';
import { CheckboxComponent } from '../../../angular-ds/src/lib/components/checkbox/checkbox.component';
import { TransactionItemComponent } from '../../../angular-ds/src/lib/components/transaction-item/transaction-item.component';
import { MenuComponent } from '../../../angular-ds/src/lib/components/menu/menu.component';
import { MenuItemComponent } from '../../../angular-ds/src/lib/components/menu/menu-item.component';
import { ToastContainerComponent } from '../../../angular-ds/src/lib/components/toast/toast-container.component';
import { ToastService } from '../../../angular-ds/src/lib/components/toast/toast.service';
import { SkipLinkComponent } from '../../../angular-ds/src/lib/components/skip-link/skip-link.component';
import { ConfirmDialogComponent } from '../../../angular-ds/src/lib/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogService } from '../../../angular-ds/src/lib/components/confirm-dialog/confirm-dialog.service';
import { SkeletonComponent } from '../../../angular-ds/src/lib/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../angular-ds/src/lib/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../angular-ds/src/lib/components/pagination/pagination.component';
import type { SelectOption } from '../../../angular-ds/src/lib/components/select/select.types';
import type { StatCardAccent } from '../../../angular-ds/src/lib/components/stat-card/stat-card.types';
import type { TransactionStatus } from '../../../angular-ds/src/lib/components/transaction-item/transaction-item.types';

/** localStorage key for the "remember this asset" checkbox demo. */
const REMEMBERED_ASSET_KEY = 'ds-remembered-asset';

type OrderSide = 'buy' | 'sell';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkipLinkComponent,
    FormsModule,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    FormLegendComponent,
    AlertComponent,
    BadgeComponent,
    StatCardComponent,
    RadioGroupComponent,
    RadioComponent,
    CheckboxComponent,
    TransactionItemComponent,
    MenuComponent,
    MenuItemComponent,
    ToastContainerComponent,
    ConfirmDialogComponent,
    SkeletonComponent,
    EmptyStateComponent,
    PaginationComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private toast = inject(ToastService);
  private confirmDialog = inject(ConfirmDialogService);

  /** Portfolio Overview briefly shows ds-skeleton placeholders while balances "load" on first paint. */
  portfolioLoading = signal(true);

  ngOnInit() {
    const saved = localStorage.getItem('ds-theme');
    if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

    // "Remember this asset" checkbox demo: if a prior visit left an asset
    // remembered, pre-select it and pre-check the box so the effect is visible.
    const rememberedAsset = localStorage.getItem(REMEMBERED_ASSET_KEY);
    if (rememberedAsset) {
      this.tradeAsset.set(rememberedAsset);
      this.rememberAsset.set(true);
    }

    setTimeout(() => this.portfolioLoading.set(false), 900);
  }

  tradeAmount = signal('');
  tradeAsset = signal('');
  tradeLoading = signal(false);
  tradeError = signal('');

  /** Buy/Sell order type — drives the execute button's label/color and the clear-form confirm message. */
  orderSide = signal<OrderSide>('buy');

  /** "Remember this asset for next time" — persists the traded asset across visits via localStorage. */
  rememberAsset = signal(false);

  assetOptions: SelectOption[] = [
    { value: 'btc', label: 'Bitcoin (BTC)' },
    { value: 'eth', label: 'Ethereum (ETH)' },
    { value: 'sol', label: 'Solana (SOL)' },
    { value: 'matic', label: 'Polygon (MATIC)' },
    { value: 'usdc', label: 'USD Coin (USDC)', disabled: true },
  ];

  /**
   * Portfolio Overview + Performance used to be two separate sections, each a
   * grid of the same "label + big number + trend" shape (balance-card and
   * metric-card respectively) — now that both are ds-stat-card, showing them
   * as two headed sections was just the same shape twice. Merged into one
   * section and trimmed from 7 cards to 5, keeping one compact-formatted
   * example (Total Trades, K-abbreviated) to still demonstrate that prop.
   */
  statCards: Array<{
    label: string;
    value: number;
    trend: number;
    icon: string;
    accent: StatCardAccent;
    prefix?: string;
    suffix?: string;
    compact?: boolean;
  }> = [
    { label: 'Portfolio Value', value: 184320.56, trend: 12.4, icon: '💼', accent: 'cyan', prefix: '$' },
    { label: 'Available Cash', value: 24800.0, trend: -3.1, icon: '💵', accent: 'violet', prefix: '$' },
    { label: 'Total Gains', value: 41290.88, trend: 24.8, icon: '🏆', accent: 'amber', prefix: '$' },
    { label: 'Total Trades', value: 1284, trend: 8.2, icon: '📊', accent: 'neutral', compact: true },
    { label: 'Win Rate', value: 68, trend: 3.5, icon: '🎯', accent: 'neutral', suffix: '%', compact: true },
  ];

  private readonly recentTradesSeed: Array<{
    name: string;
    category: string;
    date: string;
    amount: number;
    type: 'credit' | 'debit';
    status: TransactionStatus;
    avatar: string;
  }> = [
    { name: 'BTC Purchase', category: 'Buy Order', date: 'Today, 9:14 AM', amount: 5200.0, type: 'debit', status: 'success', avatar: '₿' },
    { name: 'ETH Sell', category: 'Sell Order', date: 'Today, 8:30 AM', amount: 3800.0, type: 'credit', status: 'success', avatar: 'Ξ' },
    { name: 'SOL Limit Order', category: 'Limit Buy', date: 'Yesterday', amount: 1500.0, type: 'debit', status: 'pending', avatar: '◎' },
    { name: 'MATIC Trade', category: 'Market Buy', date: 'Yesterday', amount: 420.0, type: 'debit', status: 'processing', avatar: '⬡' },
    { name: 'Portfolio Rebalance', category: 'Automated', date: '2 days ago', amount: 8900.0, type: 'credit', status: 'failed', avatar: '⚖' },
    { name: 'ADA Purchase', category: 'Buy Order', date: '2 days ago', amount: 640.0, type: 'debit', status: 'success', avatar: '₳' },
    { name: 'DOT Stake Reward', category: 'Staking', date: '3 days ago', amount: 92.5, type: 'credit', status: 'success', avatar: '●' },
    { name: 'AVAX Sell', category: 'Sell Order', date: '3 days ago', amount: 2150.0, type: 'credit', status: 'success', avatar: '▲' },
    { name: 'LINK Limit Order', category: 'Limit Buy', date: '4 days ago', amount: 780.0, type: 'debit', status: 'pending', avatar: '⬢' },
    { name: 'DOGE Trade', category: 'Market Buy', date: '4 days ago', amount: 150.0, type: 'debit', status: 'success', avatar: 'Ð' },
    { name: 'XRP Sell', category: 'Sell Order', date: '5 days ago', amount: 990.0, type: 'credit', status: 'failed', avatar: '✕' },
    { name: 'UNI Swap', category: 'Automated', date: '5 days ago', amount: 310.0, type: 'debit', status: 'success', avatar: '🦄' },
    { name: 'ATOM Purchase', category: 'Buy Order', date: '6 days ago', amount: 525.0, type: 'debit', status: 'processing', avatar: '⚛' },
    { name: 'LTC Sell', category: 'Sell Order', date: '1 week ago', amount: 1330.0, type: 'credit', status: 'success', avatar: 'Ł' },
  ];

  /** Drives the ds-empty-state demo below — cleared/restored via the Recent Trades section toggle. */
  recentTrades = signal(this.recentTradesSeed);

  tradesPageSize = 5;
  tradesCurrentPage = signal(1);

  tradesTotalPages = computed(() =>
    Math.max(Math.ceil(this.recentTrades().length / this.tradesPageSize), 1),
  );

  pagedTrades = computed(() => {
    const start = (this.tradesCurrentPage() - 1) * this.tradesPageSize;
    return this.recentTrades().slice(start, start + this.tradesPageSize);
  });

  onTradesPageChange(page: number) {
    this.tradesCurrentPage.set(page);
  }

  canExecute = computed(() => !!this.tradeAmount() && !!this.tradeAsset() && !this.tradeLoading());

  /** Execute button label reacts live to the Buy/Sell radio group state. */
  executeLabel = computed(() => {
    if (this.tradeLoading()) return 'Executing…';
    const verb = this.orderSide() === 'buy' ? 'Buy' : 'Sell';
    return this.tradeAsset() ? `${verb} ${this.tradeAsset().toUpperCase()}` : verb;
  });

  goToShowcase() {
    window.location.href = window.location.pathname.startsWith('/consumer') ? '/' : 'http://localhost:4200/';
  }

  validateAndExecute() {
    this.tradeError.set('');
    const amount = parseFloat(this.tradeAmount());
    if (!this.tradeAsset()) {
      this.tradeError.set('Please select an asset.');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      this.tradeError.set('Enter a valid trade amount.');
      return;
    }
    // Available-cash limit only makes sense on the buy side of the order-type radio group.
    if (this.orderSide() === 'buy' && amount > 24800) {
      this.tradeError.set('Exceeds available cash ($24,800).');
      return;
    }

    this.tradeLoading.set(true);
    setTimeout(() => {
      this.tradeLoading.set(false);

      const asset = this.tradeAsset();
      const verb = this.orderSide() === 'buy' ? 'Buy' : 'Sell';

      if (this.rememberAsset()) {
        localStorage.setItem(REMEMBERED_ASSET_KEY, asset);
      } else {
        localStorage.removeItem(REMEMBERED_ASSET_KEY);
      }
      const rememberedNote = this.rememberAsset() ? ` We'll remember ${asset.toUpperCase()} for next time.` : '';

      this.toast.success(
        `${verb} order placed for $${amount.toLocaleString()} of ${asset.toUpperCase()}.${rememberedNote}`,
        { title: `${verb} Order Executed` },
      );
      this.tradeAmount.set('');
      this.tradeAsset.set('');
    }, 1200);
  }

  async clearTrade() {
    // Nothing entered yet — nothing destructive to confirm.
    if (!this.tradeAmount() && !this.tradeAsset()) {
      this.tradeError.set('');
      return;
    }

    const side = this.orderSide();
    const confirmed = await this.confirmDialog.confirm({
      title: `Discard ${side} order?`,
      message: `The ${side} order details you entered will be cleared and cannot be recovered.`,
      confirmLabel: 'Discard',
      cancelLabel: 'Keep editing',
      variant: 'danger',
    });
    if (!confirmed) return;

    this.tradeAmount.set('');
    this.tradeAsset.set('');
    this.tradeError.set('');
  }

  clearRecentTrades() {
    this.recentTrades.set([]);
    this.tradesCurrentPage.set(1);
  }

  restoreRecentTrades() {
    this.recentTrades.set(this.recentTradesSeed);
    this.tradesCurrentPage.set(1);
  }

  viewTradeDetails(trade: { name: string }) {
    this.toast.info(`Showing details for "${trade.name}"`, { title: 'Trade Details' });
  }

  repeatTrade(trade: { name: string; amount: number }) {
    this.toast.success(`Repeated "${trade.name}" for $${trade.amount.toLocaleString()}`, {
      title: 'Trade Repeated',
    });
  }
}
