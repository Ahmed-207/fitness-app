import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

export type AuthFieldIcon = 'user' | 'email';

@Component({
  selector: 'app-auth-field',
  imports: [TranslatePipe],
  templateUrl: './auth-field.component.html',
  styleUrl: './auth-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AuthFieldComponent),
      multi: true,
    },
  ],
})
export class AuthFieldComponent implements ControlValueAccessor {
  readonly icon = input<AuthFieldIcon>('user');
  readonly type = input('text');
  readonly autocomplete = input<string | undefined>(undefined);
  readonly inputmode = input<string | undefined>(undefined);
  readonly placeholder = input.required<string>();
  readonly labelKey = input<string | undefined>(undefined);
  readonly error = input<string | null>(null);
  readonly invalid = input(false);

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
}
