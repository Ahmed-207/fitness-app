import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, EMPTY, finalize } from 'rxjs';
import { ACTIVITY_OPTIONS, GOAL_OPTIONS } from '../../auth/onboarding/onboarding.models';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-account-profile',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './account-profile.component.html',
  styleUrl: '../account-shared.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileComponent {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly goals = GOAL_OPTIONS;
  readonly activityLevels = ACTIVITY_OPTIONS;
  readonly isSaving = signal(false);
  readonly saved = signal(false);
  readonly error = this.auth.error;

  readonly form = this.fb.nonNullable.group({
    goal: ['', Validators.required],
    activityLevel: ['', Validators.required],
    weight: [70, [Validators.required, Validators.min(30), Validators.max(250)]],
  });

  constructor() {
    effect(() => {
      const user = this.auth.user();
      if (user && !this.form.dirty) {
        this.form.setValue({
          goal: user.goal,
          activityLevel: user.activityLevel,
          weight: user.weight,
        });
      }
    });

    if (isPlatformBrowser(this.platformId) && !this.auth.user()) {
      this.auth
        .profileData()
        .pipe(
          catchError(() => EMPTY),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSaving()) return;

    this.saved.set(false);
    this.isSaving.set(true);
    this.auth
      .editProfile(this.form.getRawValue())
      .pipe(
        catchError(() => EMPTY),
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.form.markAsPristine();
        this.saved.set(true);
      });
  }
}
