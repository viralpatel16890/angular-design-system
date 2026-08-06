import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'ds-crypto-ticker',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crypto-ticker.component.html',
  styleUrl: './crypto-ticker.component.scss',
})
export class CryptoTickerComponent {
  symbol = input('BTC');
  name = input('Bitcoin');
  price = input(0);
  change24h = input(0);
  logo = input('₿');

  displayPrice = linkedSignal(() => this.price());
  isFlashing = signal(false);

  absChange = computed(() => Math.abs(this.change24h()));
  formattedPrice = computed(
    () => '$' + this.displayPrice().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  );

  constructor() {
    const destroyRef = inject(DestroyRef);
    let flashTimeout: ReturnType<typeof setTimeout> | undefined;
    let started = false;

    effect(() => {
      if (this.price() === 0 || started) return;
      started = true;

      const interval = setInterval(() => {
        const delta = (Math.random() - 0.5) * 0.0008 * this.displayPrice();
        this.displayPrice.update((v) => Math.max(0.01, v + delta));
        this.isFlashing.set(true);
        flashTimeout = setTimeout(() => this.isFlashing.set(false), 320);
      }, 2800);

      destroyRef.onDestroy(() => {
        clearInterval(interval);
        clearTimeout(flashTimeout);
      });
    });
  }
}
