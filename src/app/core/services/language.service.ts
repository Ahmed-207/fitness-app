import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'en' | 'ar';

const STORAGE_KEY = 'fitness-app.lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);

  readonly language = signal<AppLanguage>(this.readStoredLanguage());

  init(): void {
    const lang = this.language();
    this.translate.use(lang);
    this.applyDocument(lang);
  }

  setLanguage(lang: AppLanguage): void {
    this.language.set(lang);
    this.translate.use(lang);
    this.applyDocument(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* private mode */
    }
  }

  toggleLanguage(): void {
    this.setLanguage(this.language() === 'en' ? 'ar' : 'en');
  }

  private applyDocument(lang: AppLanguage): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  private readStoredLanguage(): AppLanguage {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'ar') {
        return stored;
      }
    } catch {
      /* SSR or private mode */
    }
    return 'en';
  }
}
