import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-auth-primary-button',
  template: `
    <button
      class="auth-primary-button"
      [type]="type()"
      [disabled]="disabled()"
    >
      <ng-content />
    </button>
  `,
  styleUrl: './auth-primary-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPrimaryButtonComponent {
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
}
