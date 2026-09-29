import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Gender } from '../../models/auth.models';

@Component({
  selector: 'app-gender-step',
  templateUrl: './gender-step.component.html',
  styleUrl: './gender-step.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderStepComponent {
  readonly selected = input<Gender | null>(null);
  readonly selectedChange = output<Gender>();
}
