import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { passwordStrengthValidator } from '../../validators/password.validator';
import { AccountCredentials } from '../account-credentials';

@Component({
  selector: 'app-account-form',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormComponent {
  readonly submitted = output<AccountCredentials>();

  readonly showPassword = signal(false);
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

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }
}
