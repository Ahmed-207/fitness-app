import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, EMPTY, finalize } from 'rxjs';
import { ApiErrorService } from '../../../core/http/api-error.service';
import { AuthBackButtonComponent } from '../../../shared/components/auth/auth-back-button.component';
import { AuthFieldComponent } from '../../../shared/components/auth/auth-field.component';
import { AuthFormErrorComponent } from '../../../shared/components/auth/auth-form-error.component';
import { AuthPrimaryButtonComponent } from '../../../shared/components/auth/auth-primary-button.component';
import { AuthService } from '../services/auth.service';
import { PasswordResetFlowService } from '../services/password-reset-flow.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    AuthBackButtonComponent,
    AuthFieldComponent,
    AuthFormErrorComponent,
    AuthPrimaryButtonComponent,
  ],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly resetFlow = inject(PasswordResetFlowService);
  private readonly destroyRef = inject(DestroyRef);

  readonly apiError = inject(ApiErrorService);
  readonly isSubmitting = signal(false);

  readonly forgotForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  emailError(): string | null {
    const control = this.forgotForm.controls.email;
    if (!control.touched) {
      return null;
    }
    if (control.hasError('required')) {
      return 'AUTHPASSWORD.EMAIL_REQUIRED';
    }
    if (control.hasError('email')) {
      return 'AUTHPASSWORD.EMAIL_INVALID';
    }
    return null;
  }

  onSubmit(): void {
    this.forgotForm.markAllAsTouched();
    if (this.forgotForm.invalid || this.isSubmitting()) {
      return;
    }

    const email = this.forgotForm.controls.email.value.trim();
    this.isSubmitting.set(true);

    this.auth
      .forgotPassword({ email })
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.resetFlow.setEmail(email);
        void this.router.navigate(['/auth/verify-otp']);
      });
  }
}
