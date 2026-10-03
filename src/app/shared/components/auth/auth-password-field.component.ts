import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-password-field',
  imports: [TranslatePipe],
  templateUrl: './auth-password-field.component.html',
  styleUrl: './auth-password-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AuthPasswordFieldComponent),
      multi: true,
    },
  ],
})
export class AuthPasswordFieldComponent implements ControlValueAccessor {
  readonly autocomplete = input('current-password');
  readonly placeholder = input.required<string>();
  readonly labelKey = input<string | undefined>(undefined);
  readonly showPasswordLabelKey = input.required<string>();
  readonly hidePasswordLabelKey = input.required<string>();
  readonly error = input<string | null>(null);
  readonly invalid = input(false);

  readonly showPassword = signal(false);

  value = '';
  disabled = false;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value = next;
    this.onChange(next);
  }

  onBlur(): void {
    this.onTouched();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((show) => !show);
  }
}
