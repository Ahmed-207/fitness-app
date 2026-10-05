import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, EMPTY, finalize } from 'rxjs';
import { ApiErrorService } from '../../../core/http/api-error.service';
import { matchPasswordValidator } from '../../../core/validators/match-pass';
import { AuthBackButtonComponent } from '../../../shared/components/auth/auth-back-button.component';
import { AuthFormErrorComponent } from '../../../shared/components/auth/auth-form-error.component';
import { AuthPasswordFieldComponent } from '../../../shared/components/auth/auth-password-field.component';
import { AuthPrimaryButtonComponent } from '../../../shared/components/auth/auth-primary-button.component';
import { AuthService } from '../services/auth.service';
import { PasswordResetFlowService } from '../services/password-reset-flow.service';
import { passwordStrengthValidator } from '../validators/password.validator';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    AuthBackButtonComponent,
    AuthPasswordFieldComponent,
    AuthFormErrorComponent,
    AuthPrimaryButtonComponent,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly resetFlow = inject(PasswordResetFlowService);
  private readonly destroyRef = inject(DestroyRef);

  readonly apiError = inject(ApiErrorService);
  readonly isSubmitting = signal(false);

  readonly resetForm = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: matchPasswordValidator('password', 'confirmPassword') },
  );

  passwordError(): string | null {
    const control = this.resetForm.controls.password;
    if (!control.touched) {
      return null;
    }
    if (control.hasError('required')) {
      return 'RESET_PASS.PASSWORD_REQUIRED';
    }
    if (control.hasError('passwordStrength')) {
      return 'RESET_PASS.PASSWORD_RULE';
    }
    return null;
  }

  confirmPasswordError(): string | null {
    const control = this.resetForm.controls.confirmPassword;
    if (!control.touched) {
      return null;
    }
    if (control.hasError('required')) {
      return 'RESET_PASS.CONFIRM_REQUIRED';
    }
    if (this.resetForm.hasError('passwordMismatch')) {
      return 'RESET_PASS.PASSWORD_MISMATCH';
    }
    return null;
  }

  onSubmit(): void {
    this.resetForm.markAllAsTouched();
    if (this.resetForm.invalid || this.isSubmitting()) {
      return;
    }

    const email = this.resetFlow.email();
    if (!email) {
      void this.router.navigate(['/auth/forget-password']);
      return;
    }

    this.isSubmitting.set(true);
    this.auth
      .resetPassword({
        email,
        newPassword: this.resetForm.controls.password.value,
      })
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.resetFlow.clear();
        this.auth.clearSession();
        void this.router.navigate(['/auth/login']);
      });
  }
}
