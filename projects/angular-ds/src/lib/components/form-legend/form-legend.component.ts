import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ds-form-legend',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-legend.component.html',
  styleUrl: './form-legend.component.scss',
})
export class FormLegendComponent {
  /**
   * The note shown to explain the required-field convention used across the
   * form. Override it when a form uses a different marker or phrasing.
   */
  text = input('Fields marked with * are required');
}
