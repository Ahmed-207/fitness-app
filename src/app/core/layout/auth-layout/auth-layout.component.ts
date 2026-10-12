import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AppPreferencesBarComponent } from '../../../shared/components/app-preferences-bar/app-preferences-bar.component';
import { BrandLogoComponent } from '../../../shared/components/brand-logo/brand-logo.component';

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
  imports: [RouterOutlet, RouterLink, TranslatePipe, AppPreferencesBarComponent, BrandLogoComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {}
