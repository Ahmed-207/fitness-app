import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { OnboardingOption } from '../onboarding.models';

@Component({
  selector: 'app-option-step',
  templateUrl: './option-step.component.html',
  styleUrl: './option-step.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionStepComponent {
  readonly title = input.required<string>();
  readonly intro = input('This Helps Us Create Your Personalized Plan');
  readonly groupLabel = input.required<string>();
  readonly options = input.required<readonly OnboardingOption[]>();
  readonly selected = input<string | null>(null);
  readonly selectedChange = output<string>();
}
