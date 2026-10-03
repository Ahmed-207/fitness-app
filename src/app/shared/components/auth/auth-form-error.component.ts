import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-form-error',
  imports: [TranslatePipe],
  template: `
    @if (message()) {
      <p class="auth-form-error" role="alert">{{ message()! | translate }}</p>
    }
  `,
  styleUrl: './auth-form-error.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormErrorComponent {
  readonly message = input<string | null>(null);
}
