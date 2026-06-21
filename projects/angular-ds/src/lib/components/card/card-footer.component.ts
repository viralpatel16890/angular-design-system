import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type CardFooterJustify = 'start' | 'end' | 'between' | 'center';

@Component({
  selector: 'ds-card-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer [class]="'ds-card-footer ds-card-footer--' + justify()">
      <ng-content />
    </footer>
  `,
  styles: [`
    :host { display: block; }

    .ds-card-footer {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4) var(--card-padding, var(--space-6));
      border-top: var(--border-1) solid var(--color-border-default);
      background: var(--color-surface-subtle);
    }

    .ds-card-footer--start   { justify-content: flex-start; }
    .ds-card-footer--end     { justify-content: flex-end; }
    .ds-card-footer--between { justify-content: space-between; }
    .ds-card-footer--center  { justify-content: center; }
  `],
})
export class CardFooterComponent {
  justify = input<CardFooterJustify>('end');
}
