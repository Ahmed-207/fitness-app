import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { finalize } from 'rxjs';
import { Gender } from '../models/auth.models';
import { AccountCredentials } from '../register/account-credentials';
import { AuthService } from '../services/auth.service';
import { GenderStepComponent } from './gender-step/gender-step.component';
import {
  AGE_MAX,
  AGE_MIN,
  displayHeight,
  displayWeight,
  HEIGHT_CM_MAX,
  HEIGHT_CM_MIN,
  heightFeet,
  heightFromDisplay,
  heightInches,
  WEIGHT_KG_MAX,
  WEIGHT_KG_MIN,
  weightFromDisplay,
} from './measurement';
import { MeasurementStepComponent } from './measurement-step/measurement-step.component';
import { OnboardingChromeComponent } from './onboarding-chrome/onboarding-chrome.component';
import {
  ACTIVITY_OPTIONS,
  ActivityLevel,
  GOAL_OPTIONS,
  Goal,
  UnitSystem,
} from './onboarding.models';
import { OptionStepComponent } from './option-step/option-step.component';
import { isCompleteOnboardingDraft, toSignUpRequest } from './signup-request';

@Component({
  selector: 'app-onboarding',
  imports: [
    OnboardingChromeComponent,
    GenderStepComponent,
    MeasurementStepComponent,
    OptionStepComponent,
  ],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingComponent {
  private readonly auth = inject(AuthService);

  readonly account = input.required<AccountCredentials>();
  readonly exit = output<void>();
  readonly finished = output<void>();

  readonly step = signal(0);
  readonly gender = signal<Gender | null>(null);
  readonly age = signal(25);
  readonly weight = signal(90);
  readonly height = signal(167);
  readonly goal = signal<Goal | null>(null);
  readonly activity = signal<ActivityLevel | null>(null);
  readonly units = signal<UnitSystem>('metric');
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly goals = GOAL_OPTIONS;
  readonly activityLevels = ACTIVITY_OPTIONS;

  readonly metric = computed(() => this.units() === 'metric');
  readonly shownWeight = computed(() => displayWeight(this.weight(), this.units()));
  readonly shownHeight = computed(() => displayHeight(this.height(), this.units()));
  readonly shownHeightFeet = computed(() => heightFeet(this.shownHeight()));
  readonly shownHeightInches = computed(() => heightInches(this.shownHeight()));
  readonly continueLabel = computed(() => {
    if (this.isSubmitting()) {
      return 'Creating your plan…';
    }

    return this.step() === 5 ? 'Create my account' : 'Next';
  });

  back(): void {
    this.errorMessage.set(null);

    if (this.step() === 0) {
      this.exit.emit();
      return;
    }

    this.step.update((current) => current - 1);
  }

  next(): void {
    if (!this.hasAnswer() || this.isSubmitting()) {
      return;
    }

    if (this.step() < 5) {
      this.step.update((current) => current + 1);
      return;
    }

    this.submit();
  }

  chooseGoal(value: string): void {
    const match = GOAL_OPTIONS.find((option) => option.value === value);
    if (match) {
      this.goal.set(match.value);
    }
  }

  chooseActivity(value: string): void {
    const match = ACTIVITY_OPTIONS.find((option) => option.value === value);
    if (match) {
      this.activity.set(match.value);
    }
  }

  onWeight(value: number): void {
    this.weight.set(weightFromDisplay(value, this.units()));
  }

  onHeight(value: number): void {
    this.height.set(heightFromDisplay(value, this.units()));
  }

  hasAnswer(): boolean {
    switch (this.step()) {
      case 0:
        return this.gender() !== null;
      case 1:
        return this.age() >= AGE_MIN && this.age() <= AGE_MAX;
      case 2:
        return this.weight() >= WEIGHT_KG_MIN && this.weight() <= WEIGHT_KG_MAX;
      case 3:
        return this.height() >= HEIGHT_CM_MIN && this.height() <= HEIGHT_CM_MAX;
      case 4:
        return this.goal() !== null;
      case 5:
        return this.activity() !== null;
      default:
        return false;
    }
  }

  private submit(): void {
    const draft = {
      gender: this.gender(),
      age: this.age(),
      weight: this.weight(),
      height: this.height(),
      goal: this.goal(),
      activity: this.activity(),
    };

    if (!isCompleteOnboardingDraft(draft)) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.auth
      .signUp(toSignUpRequest(this.account(), draft))
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => this.finished.emit(),
        error: () =>
          this.errorMessage.set(
            this.auth.error() ?? 'We couldn’t create your account. Please try again.',
          ),
      });
  }
}
