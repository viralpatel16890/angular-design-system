import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';
import type { BadgeVariant } from '../badge/badge.types';
import type { TransactionStatus, TransactionType } from './transaction-item.types';

const STATUS_TO_BADGE_VARIANT: Record<TransactionStatus, BadgeVariant> = {
  success: 'success',
  processing: 'info',
  pending: 'warning',
  failed: 'danger',
  cancelled: 'default',
};

@Component({
  selector: 'ds-transaction-item',
  standalone: true,
  imports: [BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transaction-item.component.html',
  styleUrl: './transaction-item.component.scss',
})
export class TransactionItemComponent {
  name = input('');
  category = input('');
  date = input('');
  amount = input(0);
  type = input<TransactionType>('debit');
  status = input<TransactionStatus>('success');
  avatar = input('💳');
  clickable = input(true);
  ariaLabel = input('');

  itemClicked = output<void>();

  formattedAmount = computed(
    () => '$' + this.amount().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  );
  badgeVariant = computed<BadgeVariant>(() => STATUS_TO_BADGE_VARIANT[this.status()]);
}
