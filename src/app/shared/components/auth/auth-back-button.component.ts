import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-back-button',
  imports: [RouterLink, TranslatePipe],
  template: `
    @if (route()) {
      <a class="auth-back-button" [routerLink]="route()!">
        ← {{ labelKey() | translate }}
      </a>
    } @else {
      <button class="auth-back-button" type="button" (click)="pressed.emit()">
        ← {{ labelKey() | translate }}
      </button>
    }
  `,
  styleUrl: './auth-back-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthBackButtonComponent {
  readonly route = input<string | null>(null);
  readonly labelKey = input('AUTHCOMMON.BACK');
  readonly pressed = output<void>();
}
