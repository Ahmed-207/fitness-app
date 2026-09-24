import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Placeholder login page.
 *
 * This is a temporary stand-in so the auth layout can be visually verified.
 * The real login form will replace this component.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {}
