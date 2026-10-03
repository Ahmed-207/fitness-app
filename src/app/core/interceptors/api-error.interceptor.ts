import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiErrorService } from '../http/api-error.service';
import { readApiErrorMessage } from '../http/read-api-error-message';

/** Shown via the translate pipe in templates — avoids injecting TranslateService in this interceptor (HTTP ↔ i18n cycle). */
export const REQUEST_FAILED_MESSAGE_KEY = 'ERRORS.REQUEST_FAILED';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url.includes('/i18n/')) {
    return next(request);
  }

  const apiError = inject(ApiErrorService);

  apiError.clear();

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        apiError.set(readApiErrorMessage(error.error) ?? REQUEST_FAILED_MESSAGE_KEY);
      }

      return throwError(() => error);
    }),
  );
};
