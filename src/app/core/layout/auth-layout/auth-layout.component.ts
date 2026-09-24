import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Shell layout for auth-related routes.
 *
 * Renders a full-screen background with a blurred dark overlay, a branded
 * visual panel on the left, and a glassmorphism card on the right that hosts
 * child routes. On small screens the visual panel is hidden and only the logo
 * plus the card are shown.
 */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {}
