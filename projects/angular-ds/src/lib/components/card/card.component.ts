import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import type { CardVariant, CardPadding } from './card.types';

@Component({
  selector: 'ds-card',
  standalone: true,
  imports: [SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  variant     = input<CardVariant>('elevated');
  padding     = input<CardPadding>('md');
  interactive = input(false);
  fullHeight  = input(false);
  loading     = input(false);

  classes = computed(() => [
    'ds-card',
    `ds-card--${this.variant()}`,
    `ds-card--p-${this.padding()}`,
    this.interactive() ? 'ds-card--interactive' : '',
    this.fullHeight() ? 'ds-card--full-height' : '',
    this.loading() ? 'ds-card--loading' : '',
  ].filter(Boolean).join(' '));
}
