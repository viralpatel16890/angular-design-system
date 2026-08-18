import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ds-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  /** Short headline, e.g. "No trades yet". */
  title = input('');
  /** Supporting copy explaining why the list is empty or what to do next. */
  description = input('');
}
