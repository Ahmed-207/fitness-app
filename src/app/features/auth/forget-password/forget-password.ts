import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthBackButtonComponent } from '../../../shared/components/auth/auth-back-button.component';
import { AuthFieldComponent } from '../../../shared/components/auth/auth-field.component';
import { AuthPrimaryButtonComponent } from '../../../shared/components/auth/auth-primary-button.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    AuthBackButtonComponent,
    AuthFieldComponent,
    AuthPrimaryButtonComponent,
  ],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  private readonly router = inject(Router);

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
    if (this.forgotForm.invalid) {
      return;
    }

    console.log('Sending OTP to:', this.forgotForm.value.email);
    void this.router.navigate(['/auth/verify-otp']);
  }
}
