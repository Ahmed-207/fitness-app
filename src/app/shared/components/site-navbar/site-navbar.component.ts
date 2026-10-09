import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, EMPTY, finalize } from 'rxjs';
import { AuthSessionService } from '../../../core/services/auth-session.service';
import { LanguageService } from '../../../core/services/language.service';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../features/auth/services/auth.service';

interface NavigationItem {
  readonly label: string;
  readonly path: string;
}

@Component({
  selector: 'app-site-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './site-navbar.component.html',
  styleUrl: './site-navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteNavbarComponent {
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);
  private readonly session = inject(AuthSessionService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly navigation: readonly NavigationItem[] = [
    { label: 'NAV.HOME', path: '/home' },
    { label: 'NAV.ABOUT', path: '/about-us' },
    { label: 'NAV.CLASSES', path: '/classes' },
    { label: 'NAV.HEALTHY', path: '/healthy' },
  ];

  readonly currentTheme = this.themeService.theme;
  readonly currentLanguage = this.languageService.language;
  readonly isAuthenticated = this.session.isAuthenticated;
  readonly user = this.session.user;
  readonly isMenuOpen = signal(false);
  readonly isProfileOpen = signal(false);
  readonly isSigningOut = signal(false);

  readonly userInitials = computed(() => {
    const user = this.user();
    return user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : '';
  });

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
    this.isProfileOpen.set(false);
  }

  toggleProfile(): void {
    this.isProfileOpen.update((isOpen) => !isOpen);
  }

  closeMenus(): void {
    this.isMenuOpen.set(false);
    this.isProfileOpen.set(false);
  }

  signOut(): void {
    if (this.isSigningOut()) {
      return;
    }

    this.isSigningOut.set(true);
    this.auth
      .signOut()
      .pipe(
        catchError(() => {
          this.auth.clearSession();
          return EMPTY;
        }),
        finalize(() => this.isSigningOut.set(false)),
      )
      .subscribe({
        complete: () => {
          this.closeMenus();
          void this.router.navigate(['/auth/login']);
        },
      });
  }
}
