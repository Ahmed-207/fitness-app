import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';
import { ApiErrorService } from '../http/api-error.service';
import { readApiErrorMessage } from '../http/read-api-error-message';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const apiError = inject(ApiErrorService);
  const translate = inject(TranslateService);

  apiError.clear();

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        apiError.set(readApiErrorMessage(error.error) ?? translate.instant('ERRORS.REQUEST_FAILED'));
      }

      return throwError(() => error);
    }),
  );
};
