import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-onboarding-chrome',
  templateUrl: './onboarding-chrome.component.html',
  styleUrl: './onboarding-chrome.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingChromeComponent {
  readonly step = input.required<number>();
  readonly canContinue = input.required<boolean>();
  readonly isSubmitting = input.required<boolean>();
  readonly continueLabel = input.required<string>();
  readonly errorMessage = input<string | null>(null);

  readonly back = output<void>();
  readonly nextStep = output<void>();

  readonly stepNumber = computed(() => this.step() + 1);
  readonly progressOffset = computed(() => 169.65 * (1 - this.stepNumber() / 6));
}
