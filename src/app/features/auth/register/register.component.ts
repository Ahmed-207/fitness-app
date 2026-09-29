import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Gender, SignUpRequest } from '../models/auth.models';

type Goal = 'Gain weight' | 'Lose weight' | 'Get fitter' | 'Improve flexibility' | 'Learn the basics';
type ActivityLevel = 'level1' | 'level2' | 'level3' | 'level4' | 'level5';
type UnitSystem = 'metric' | 'imperial';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);

  readonly credentials = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(60)] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(60)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
  });

  readonly step = signal(-1);
  readonly complete = signal(false);
  readonly showPassword = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly gender = signal<Gender | null>(null);
  readonly age = signal(25);
  readonly weight = signal(90);
  readonly height = signal(167);
  readonly goal = signal<Goal | null>(null);
  readonly activity = signal<ActivityLevel | null>(null);
  readonly units = signal<UnitSystem>('metric');
  private measurementPointerStart: { id: number; x: number; y: number } | null = null;

  readonly goals: { value: Goal; label: string; detail: string }[] = [
    { value: 'Gain weight', label: 'Gain Weight', detail: '' },
    { value: 'Lose weight', label: 'Lose Weight', detail: '' },
    { value: 'Get fitter', label: 'Get Fitter', detail: '' },
    { value: 'Improve flexibility', label: 'Gain More Flexible', detail: '' },
    { value: 'Learn the basics', label: 'Learn The Basic', detail: '' },
  ];

  readonly activityLevels: { value: ActivityLevel; label: string; detail: string }[] = [
    { value: 'level1', label: 'Rookie', detail: '' },
    { value: 'level2', label: 'Beginner', detail: 'I train occasionally' },
    { value: 'level3', label: 'Intermediate', detail: 'I train a few times a week' },
    { value: 'level4', label: 'Advance', detail: '' },
    { value: 'level5', label: 'True Beast', detail: '' },
  ];

  get isMetric(): boolean {
    return this.units() === 'metric';
  }

  get displayWeight(): number {
    return this.isMetric ? Math.round(this.weight()) : Math.max(66, Math.min(550, Math.round(this.weight() * 2.20462)));
  }

  get displayHeight(): number {
    return this.isMetric ? Math.round(this.height()) : Math.max(47, Math.min(90, Math.round(this.height() / 2.54)));
  }

  get displayHeightFeet(): number {
    return Math.floor(this.displayHeight / 12);
  }

  get displayHeightInches(): number {
    return this.displayHeight % 12;
  }

  beginOnboarding(): void {
    this.credentials.markAllAsTouched();
    if (this.credentials.invalid) return;
    this.errorMessage.set(null);
    this.step.set(0);
  }

  back(): void {
    this.errorMessage.set(null);
    if (this.step() === 0) {
      this.step.set(-1);
      return;
    }
    this.step.update((current) => Math.max(0, current - 1));
  }

  next(): void {
    if (!this.hasAnswerForCurrentStep()) return;
    if (this.step() < 5) {
      this.step.update((current) => current + 1);
      return;
    }
    this.submitRegistration();
  }

  chooseGender(value: Gender): void {
    this.gender.set(value);
  }

  chooseGoal(value: Goal): void {
    this.goal.set(value);
  }

  chooseActivity(value: ActivityLevel): void {
    this.activity.set(value);
  }

  setUnits(units: UnitSystem): void {
    this.units.set(units);
  }

  setDisplayWeight(value: number): void {
    this.weight.set(this.isMetric ? Math.max(30, Math.min(250, value)) : Math.max(30, Math.min(250, value / 2.20462)));
  }

  setDisplayHeight(value: number): void {
    this.height.set(this.isMetric ? Math.max(120, Math.min(230, value)) : Math.max(120, Math.min(230, value * 2.54)));
  }

  adjustAge(delta: number): void {
    this.age.update((value) => Math.min(100, Math.max(16, value + delta)));
  }

  adjustWeight(delta: number): void {
    this.setDisplayWeight(Math.min(this.isMetric ? 250 : 550, Math.max(this.isMetric ? 30 : 66, this.displayWeight + delta)));
  }

  adjustHeight(delta: number): void {
    this.setDisplayHeight(Math.min(this.isMetric ? 230 : 90, Math.max(this.isMetric ? 120 : 47, this.displayHeight + delta)));
  }

  measurementValues(value: number, minimum: number, maximum: number): (number | null)[] {
    const firstValue = value - 4;
    return Array.from({ length: 9 }, (_, index) => {
      const nextValue = firstValue + index;
      return nextValue < minimum || nextValue > maximum ? null : nextValue;
    });
  }

  isNearWheelValue(index: number): boolean {
    return Math.abs(index - 4) === 1;
  }

  selectMeasurement(kind: 'age' | 'weight' | 'height', value: number): void {
    if (kind === 'age') this.age.set(value);
    else if (kind === 'weight') this.setDisplayWeight(value);
    else this.setDisplayHeight(value);
  }

  onMeasurementKeydown(event: KeyboardEvent, kind: 'age' | 'weight' | 'height'): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const delta = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
    if (kind === 'age') {
      if (event.key === 'Home') this.age.set(16);
      else if (event.key === 'End') this.age.set(100);
      else this.adjustAge(delta);
    } else if (kind === 'weight') {
      if (event.key === 'Home') this.setDisplayWeight(this.isMetric ? 30 : 66);
      else if (event.key === 'End') this.setDisplayWeight(this.isMetric ? 250 : 550);
      else this.adjustWeight(delta);
    } else {
      if (event.key === 'Home') this.setDisplayHeight(this.isMetric ? 120 : 47);
      else if (event.key === 'End') this.setDisplayHeight(this.isMetric ? 230 : 90);
      else this.adjustHeight(delta);
    }
  }

  onMeasurementWheel(event: WheelEvent, kind: 'age' | 'weight' | 'height'): void {
    const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(movement) < 4) return;
    event.preventDefault();
    if (kind === 'age') this.adjustAge(movement > 0 ? 1 : -1);
    else if (kind === 'weight') this.adjustWeight(movement > 0 ? 1 : -1);
    else this.adjustHeight(movement > 0 ? 1 : -1);
  }

  startMeasurementSwipe(event: PointerEvent): void {
    if (event.pointerType === 'mouse') return;
    this.measurementPointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  cancelMeasurementSwipe(): void {
    this.measurementPointerStart = null;
  }

  endMeasurementSwipe(event: PointerEvent, kind: 'age' | 'weight' | 'height'): void {
    const start = this.measurementPointerStart;
    this.measurementPointerStart = null;
    if (!start || start.id !== event.pointerId) return;
    const horizontal = start.x - event.clientX;
    const vertical = start.y - event.clientY;
    if (Math.abs(horizontal) < 20 || Math.abs(horizontal) < Math.abs(vertical)) return;
    event.preventDefault();
    const steps = Math.max(1, Math.min(4, Math.round(Math.abs(horizontal) / 28)));
    const delta = Math.sign(horizontal) * steps;
    if (kind === 'age') this.adjustAge(delta);
    else if (kind === 'weight') this.adjustWeight(delta);
    else this.adjustHeight(delta);
  }

  hasAnswerForCurrentStep(): boolean {
    const answer = [
      this.gender(),
      this.age() >= 16 && this.age() <= 100,
      this.weight() >= 30 && this.weight() <= 250,
      this.height() >= 120 && this.height() <= 230,
      this.goal(),
      this.activity(),
    ][this.step()];
    return Boolean(answer);
  }

  private submitRegistration(): void {
    const fields = this.credentials.getRawValue();
    const request: SignUpRequest = {
      ...fields,
      rePassword: fields.password,
      gender: this.gender()!,
      age: this.age(),
      weight: this.weight(),
      height: this.height(),
      goal: this.goal()!,
      activityLevel: this.activity()!,
    };

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.auth.signUp(request).pipe(finalize(() => this.isSubmitting.set(false))).subscribe({
      next: () => this.complete.set(true),
      error: () => this.errorMessage.set(this.auth.error() ?? 'We couldn’t create your account. Please try again.'),
    });
  }
}
