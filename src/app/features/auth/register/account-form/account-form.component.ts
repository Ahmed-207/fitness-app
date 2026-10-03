import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { passwordStrengthValidator } from '../../validators/password.validator';
import { AccountCredentials } from '../account-credentials';
import { AuthFieldComponent } from '../../../../shared/components/auth/auth-field.component';
import { AuthPasswordFieldComponent } from '../../../../shared/components/auth/auth-password-field.component';
import { AuthBackButtonComponent } from '../../../../shared/components/auth/auth-back-button.component';
import { AuthPrimaryButtonComponent } from '../../../../shared/components/auth/auth-primary-button.component';

@Component({
  selector: 'app-account-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    AuthFieldComponent,
    AuthPasswordFieldComponent,
    AuthBackButtonComponent,
    AuthPrimaryButtonComponent,
  ],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormComponent {
  readonly submitted = output<AccountCredentials>();

  readonly form = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(60)],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(60)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, passwordStrengthValidator],
    }),
  });

  firstNameError(): string | null {
    const control = this.form.controls.firstName;
    if (!control.touched) {
      return null;
    }
    if (control.hasError('required')) {
      return 'AUTHREGISTER.FIRST_NAME_REQUIRED';
    }
    if (control.hasError('minlength')) {
      return 'AUTHREGISTER.NAME_MIN_LENGTH';
    }
    return null;
  }

  lastNameError(): string | null {
    const control = this.form.controls.lastName;
    if (!control.touched) {
      return null;
    }
    if (control.hasError('required')) {
      return 'AUTHREGISTER.LAST_NAME_REQUIRED';
    }
    if (control.hasError('minlength')) {
      return 'AUTHREGISTER.NAME_MIN_LENGTH';
    }
    return null;
  }

  emailError(): string | null {
    const control = this.form.controls.email;
    if (!control.touched || !control.invalid) {
      return null;
    }
    return 'AUTHREGISTER.EMAIL_INVALID';
  }

  passwordError(): string | null {
    const control = this.form.controls.password;
    if (!control.touched) {
      return null;
    }
    if (control.hasError('required')) {
      return 'AUTHREGISTER.PASSWORD_REQUIRED';
    }
    if (control.hasError('passwordStrength')) {
      return 'AUTHREGISTER.PASSWORD_RULE';
    }
    return null;
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }
}
