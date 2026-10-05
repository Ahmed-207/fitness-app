import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, EMPTY, finalize } from 'rxjs';
import { ApiErrorService } from '../../../core/http/api-error.service';
import { AuthBackButtonComponent } from '../../../shared/components/auth/auth-back-button.component';
import { AuthFormErrorComponent } from '../../../shared/components/auth/auth-form-error.component';
import { AuthPrimaryButtonComponent } from '../../../shared/components/auth/auth-primary-button.component';
import { AuthService } from '../services/auth.service';
import { PasswordResetFlowService } from '../services/password-reset-flow.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    AuthBackButtonComponent,
    AuthFormErrorComponent,
    AuthPrimaryButtonComponent,
  ],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyOtpComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly resetFlow = inject(PasswordResetFlowService);
  private readonly destroyRef = inject(DestroyRef);

  readonly apiError = inject(ApiErrorService);
  readonly isSubmitting = signal(false);
  readonly isResending = signal(false);
  readonly otpForm = this.fb.nonNullable.group({
    otpInputs: this.fb.nonNullable.group({
      digit1: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit2: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit3: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit4: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit5: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      digit6: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
    }),
  });

  onDigitInput(
    event: KeyboardEvent,
    nextInput: HTMLInputElement | null,
    prevInput: HTMLInputElement | null,
  ): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && prevInput) {
      prevInput.focus();
      return;
    }

    if (input.value && nextInput) {
      nextInput.focus();
    }
  }

  onVerify(): void {
    this.otpForm.markAllAsTouched();
    if (this.otpForm.invalid || this.isSubmitting()) {
      return;
    }

    if (!this.requireEmail()) {
      return;
    }

    const resetCode = Object.values(this.otpForm.controls.otpInputs.getRawValue()).join('');
    this.isSubmitting.set(true);

    this.auth
      .verifyResetCode({ resetCode })
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => void this.router.navigate(['/auth/reset-password']));
  }

  resendCode(): void {
    if (this.isResending()) {
      return;
    }

    const email = this.requireEmail();
    if (!email) {
      return;
    }

    this.isResending.set(true);
    this.auth
      .forgotPassword({ email })
      .pipe(
        finalize(() => this.isResending.set(false)),
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.otpForm.controls.otpInputs.reset());
  }

  private requireEmail(): string | null {
    const email = this.resetFlow.email();
    if (!email) {
      void this.router.navigate(['/auth/forget-password']);
    }

    return email;
  }
}
