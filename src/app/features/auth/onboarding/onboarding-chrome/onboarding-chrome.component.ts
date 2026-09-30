import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiErrorService } from '../../../../core/http/api-error.service';

@Component({
  selector: 'app-onboarding-chrome',
  imports: [TranslatePipe],
  templateUrl: './onboarding-chrome.component.html',
  styleUrl: './onboarding-chrome.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingChromeComponent {
  readonly apiError = inject(ApiErrorService);
  readonly step = input.required<number>();
  readonly canContinue = input.required<boolean>();
  readonly isSubmitting = input.required<boolean>();

  readonly back = output<void>();
  readonly nextStep = output<void>();

  readonly stepNumber = computed(() => this.step() + 1);
  readonly progressOffset = computed(() => 169.65 * (1 - this.stepNumber() / 6));
}
