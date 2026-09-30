import { AbstractControl, ValidationErrors } from '@angular/forms';

/** Same rule the fitness API enforces on signup and signin. */
export const API_PASSWORD_PATTERN =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (typeof value !== 'string' || value.length === 0) {
    return null;
  }

  return API_PASSWORD_PATTERN.test(value) ? null : { passwordStrength: true };
}
