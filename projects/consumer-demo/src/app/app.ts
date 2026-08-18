import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../angular-ds/src/lib/components/button/button.component';
import { InputComponent } from '../../../angular-ds/src/lib/components/input/input.component';
import { SelectComponent } from '../../../angular-ds/src/lib/components/select/select.component';
import { AlertComponent } from '../../../angular-ds/src/lib/components/alert/alert.component';
import { BadgeComponent } from '../../../angular-ds/src/lib/components/badge/badge.component';
import { BalanceCardComponent } from '../../../angular-ds/src/lib/components/balance-card/balance-card.component';
import { MetricCardComponent } from '../../../angular-ds/src/lib/components/metric-card/metric-card.component';
import { TransactionItemComponent } from '../../../angular-ds/src/lib/components/transaction-item/transaction-item.component';
import { MenuComponent } from '../../../angular-ds/src/lib/components/menu/menu.component';
import { MenuItemComponent } from '../../../angular-ds/src/lib/components/menu/menu-item.component';
import { ToastContainerComponent } from '../../../angular-ds/src/lib/components/toast/toast-container.component';
import { ToastService } from '../../../angular-ds/src/lib/components/toast/toast.service';
import type { SelectOption } from '../../../angular-ds/src/lib/components/select/select.types';
import type { BalanceCardAccent } from '../../../angular-ds/src/lib/components/balance-card/balance-card.types';
import type { TransactionStatus } from '../../../angular-ds/src/lib/components/transaction-item/transaction-item.types';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    AlertComponent,
    BadgeComponent,
    BalanceCardComponent,
    MetricCardComponent,
    TransactionItemComponent,
    MenuComponent,
    MenuItemComponent,
    ToastContainerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private toast = inject(ToastService);

  ngOnInit() {
    const saved = localStorage.getItem('ds-theme');
    if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  }

  tradeAmount = signal('');
  tradeAsset = signal('');
  tradeLoading = signal(false);
  tradeError = signal('');

  assetOptions: SelectOption[] = [
    { value: 'btc', label: 'Bitcoin (BTC)' },
    { value: 'eth', label: 'Ethereum (ETH)' },
    { value: 'sol', label: 'Solana (SOL)' },
    { value: 'matic', label: 'Polygon (MATIC)' },
    { value: 'usdc', label: 'USD Coin (USDC)', disabled: true },
  ];

  balances: Array<{ label: string; amount: number; trend: number; icon: string; accent: BalanceCardAccent }> = [
    { label: 'Portfolio Value', amount: 184320.56, trend: 12.4, icon: '💼', accent: 'cyan' },
    { label: 'Available Cash', amount: 24800.0, trend: -3.1, icon: '💵', accent: 'violet' },
    { label: 'Total Gains', amount: 41290.88, trend: 24.8, icon: '🏆', accent: 'amber' },
  ];

  metrics = [
    { label: 'Total Trades', value: 1284, change: 8.2, icon: '📊', prefix: '', suffix: '' },
    { label: 'Win Rate', value: 68, change: 3.5, icon: '🎯', prefix: '', suffix: '%' },
    { label: 'Avg Return', value: 2400, change: 12.1, icon: '📈', prefix: '$', suffix: '' },
    { label: 'Active Positions', value: 7, change: -1.0, icon: '⚡', prefix: '', suffix: '' },
  ];

  recentTrades: Array<{
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
  ];

  canExecute = computed(() => !!this.tradeAmount() && !!this.tradeAsset() && !this.tradeLoading());

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
    if (amount > 24800) {
      this.tradeError.set('Exceeds available cash ($24,800).');
      return;
    }

    this.tradeLoading.set(true);
    setTimeout(() => {
      this.tradeLoading.set(false);
      this.toast.success(`${this.tradeAsset().toUpperCase()} order placed for $${amount.toLocaleString()}`, {
        title: 'Trade Executed',
      });
      this.tradeAmount.set('');
      this.tradeAsset.set('');
    }, 1200);
  }

  clearTrade() {
    this.tradeAmount.set('');
    this.tradeAsset.set('');
    this.tradeError.set('');
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
