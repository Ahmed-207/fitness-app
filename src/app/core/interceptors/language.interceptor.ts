import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LanguageService } from '../services/language.service';

export const languageInterceptor: HttpInterceptorFn = (request, next) => {
  if (
    !request.url.startsWith(environment.apiBaseUrl) ||
    request.url.includes('/i18n/')
  ) {
    return next(request);
  }

  const lang = inject(LanguageService).language();

  return next(
    request.clone({
      setHeaders: { 'Accept-Language': lang },
    }),
  );
};
