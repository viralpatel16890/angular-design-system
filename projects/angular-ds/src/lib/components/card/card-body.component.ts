import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ds-card-body',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="ds-card-body"><ng-content /></div>`,
  styles: [`
    :host { display: block; }
    .ds-card-body {
      padding: var(--card-padding, var(--space-6));
      color: var(--color-text-primary);
      font-size: var(--font-size-md);
      line-height: var(--line-height-relaxed);
    }
  `],
})
export class CardBodyComponent {}
