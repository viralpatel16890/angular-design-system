import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ds-form-error',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (message()) {
      <p class="ds-form-error" role="alert" aria-live="polite">
        <svg class="ds-form-error__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 5v3.5M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        {{ message() }}
      </p>
    }
  `,
  styles: [`
    :host { display: contents; }
    .ds-form-error {
      display: flex;
      align-items: center;
      gap: .375rem;
      margin: .25rem 0 0;
      font-size: var(--font-size-xs);
      color: var(--color-feedback-error, #ef4444);
      font-family: var(--font-family-sans);
    }
    .ds-form-error__icon {
      width: .875rem;
      height: .875rem;
      flex-shrink: 0;
    }
  `],
})
export class FormErrorComponent {
  message = input('');
}
