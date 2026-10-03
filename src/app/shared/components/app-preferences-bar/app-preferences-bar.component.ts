import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-preferences-bar',
  imports: [TranslatePipe],
  templateUrl: './app-preferences-bar.component.html',
  styleUrl: './app-preferences-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppPreferencesBarComponent {
  private readonly theme = inject(ThemeService);
  private readonly language = inject(LanguageService);

  readonly currentTheme = this.theme.theme;
  readonly currentLanguage = this.language.language;

  setTheme(theme: 'dark' | 'light'): void {
    this.theme.setTheme(theme);
  }

  setLanguage(lang: 'en' | 'ar'): void {
    this.language.setLanguage(lang);
  }
}
