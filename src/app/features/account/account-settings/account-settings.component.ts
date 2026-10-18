import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, EMPTY, finalize } from 'rxjs';
import { LanguageService } from '../../../core/services/language.service';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-account-settings',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettingsComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);

  readonly user = this.auth.user;
  readonly theme = this.themeService.theme;
  readonly language = this.languageService.language;
  readonly isSigningOut = signal(false);

  readonly goalKey = computed(() => {
    const goal = this.user()?.goal;
    const keys: Record<string, string> = {
      'Gain weight': 'ONBOARDING.GOAL_GAIN_WEIGHT',
      'Lose weight': 'ONBOARDING.GOAL_LOSE_WEIGHT',
      'Get fitter': 'ONBOARDING.GOAL_GET_FITTER',
      'Improve flexibility': 'ONBOARDING.GOAL_FLEXIBILITY',
      'Learn the basics': 'ONBOARDING.GOAL_BASICS',
    };
    return goal ? (keys[goal] ?? goal) : 'ACCOUNT.COMMON.NOT_SET';
  });

  readonly activityKey = computed(() => {
    const level = this.user()?.activityLevel;
    const keys: Record<string, string> = {
      level1: 'ONBOARDING.LEVEL_ROOKIE',
      level2: 'ONBOARDING.LEVEL_BEGINNER',
      level3: 'ONBOARDING.LEVEL_INTERMEDIATE',
      level4: 'ONBOARDING.LEVEL_ADVANCE',
      level5: 'ONBOARDING.LEVEL_BEAST',
    };
    return level ? (keys[level] ?? level) : 'ACCOUNT.COMMON.NOT_SET';
  });

  constructor() {
    this.auth
      .profileData()
      .pipe(
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  signOut(): void {
    if (this.isSigningOut()) return;

    this.isSigningOut.set(true);
    this.auth
      .signOut()
      .pipe(
        catchError(() => EMPTY),
        finalize(() => {
          this.isSigningOut.set(false);
          void this.router.navigate(['/auth/login']);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
