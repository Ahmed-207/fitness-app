import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, EMPTY, finalize } from 'rxjs';
import { ApiErrorService } from '../../../core/http/api-error.service';
import { AuthFieldComponent } from '../../../shared/components/auth/auth-field.component';
import { AuthFormErrorComponent } from '../../../shared/components/auth/auth-form-error.component';
import { AuthPasswordFieldComponent } from '../../../shared/components/auth/auth-password-field.component';
import { AuthBackButtonComponent } from '../../../shared/components/auth/auth-back-button.component';
import { AuthPrimaryButtonComponent } from '../../../shared/components/auth/auth-primary-button.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    AuthFieldComponent,
    AuthPasswordFieldComponent,
    AuthBackButtonComponent,
    AuthPrimaryButtonComponent,
    AuthFormErrorComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly apiError = inject(ApiErrorService);
  readonly isSubmitting = signal(false);
  readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  emailError(): string | null {
    const control = this.loginForm.controls.email;
    if (!control.touched) {
      return null;
    }
    if (control.hasError('required')) {
      return 'AUTHLOGIN.EMAIL_REQUIRED';
    }
    if (control.hasError('email')) {
      return 'AUTHLOGIN.EMAIL_INVALID';
    }
    return null;
  }

  passwordError(): string | null {
    const control = this.loginForm.controls.password;
    if (!control.touched) {
      return null;
    }
    if (control.hasError('required')) {
      return 'AUTHLOGIN.PASSWORD_REQUIRED';
    }
    if (control.hasError('minlength')) {
      return 'AUTHLOGIN.PASSWORD_MIN_LENGTH';
    }
    return null;
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.auth
      .signIn(this.loginForm.getRawValue())
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (returnUrl?.startsWith('/') && !returnUrl.startsWith('//')) {
          void this.router.navigateByUrl(returnUrl);
        }
      });
  }
}
