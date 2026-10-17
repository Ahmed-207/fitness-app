import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, EMPTY, finalize } from 'rxjs';
import { matchPasswordValidator } from '../../../core/validators/match-pass';
import { AuthService } from '../../auth/services/auth.service';
import { passwordStrengthValidator } from '../../auth/validators/password.validator';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './change-password.component.html',
  styleUrl: '../account-shared.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSaving = signal(false);
  readonly saved = signal(false);
  readonly error = this.auth.error;
  readonly showPasswords = signal(false);

  readonly form = this.fb.nonNullable.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
    },
    { validators: matchPasswordValidator('newPassword', 'confirmPassword') },
  );

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSaving()) return;

    this.saved.set(false);
    this.isSaving.set(true);
    this.auth
      .changePassword({
        password: this.form.controls.currentPassword.value,
        newPassword: this.form.controls.newPassword.value,
      })
      .pipe(
        catchError(() => EMPTY),
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.form.reset();
        this.saved.set(true);
      });
  }
}
