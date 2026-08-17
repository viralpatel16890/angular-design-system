import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ds-skip-link',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skip-link.component.html',
  styleUrl: './skip-link.component.scss',
})
export class SkipLinkComponent {
  /** ID (without the leading `#`) of the main content landmark to jump to. */
  targetId = input('main-content');
  /** Visible/announced label for the link. */
  label = input('Skip to main content');

  href = computed(() => `#${this.targetId()}`);
}
