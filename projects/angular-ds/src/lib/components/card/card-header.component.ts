import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ds-card-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="ds-card-header">
      <div class="ds-card-header__main">
        <ng-content select="[slot=title]" />
        @if (subtitle()) {
          <p class="ds-card-header__subtitle">{{ subtitle() }}</p>
        }
        <ng-content />
      </div>
      <ng-content select="[slot=action]" />
    </header>
  `,
  styles: [`
    :host { display: block; }

    .ds-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-4);
      padding: var(--card-padding, var(--space-6));
      padding-bottom: 0;
    }

    .ds-card-header__main {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      min-width: 0;
    }

    .ds-card-header__subtitle {
      margin: 0;
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      line-height: var(--line-height-normal);
    }
  `],
})
export class CardHeaderComponent {
  subtitle = input('');
}
