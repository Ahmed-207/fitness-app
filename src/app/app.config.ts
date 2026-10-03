import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { apiErrorInterceptor } from './core/interceptors/api-error.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { languageInterceptor } from './core/interceptors/language.interceptor';
import { unauthorizedInterceptor } from './core/interceptors/unauthorized.interceptor';
import { LanguageService } from './core/services/language.service';
import { ThemeService } from './core/services/theme.service';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        languageInterceptor,
        authInterceptor,
        unauthorizedInterceptor,
        apiErrorInterceptor,
      ]),
    ),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (theme: ThemeService, language: LanguageService) => () => {
        theme.init();
        language.init();
      },
      deps: [ThemeService, LanguageService],
    },
    provideClientHydration(withEventReplay()),
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
