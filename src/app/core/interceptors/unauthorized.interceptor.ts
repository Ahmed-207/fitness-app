import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { isPublicAuthRequest } from '../auth/public-auth-request';
import { AuthSessionService } from '../services/auth-session.service';

export const unauthorizedInterceptor: HttpInterceptorFn = (request, next) => {
  const session = inject(AuthSessionService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: unknown) => {
      const isExpiredSession =
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !isPublicAuthRequest(request.url);

      if (isExpiredSession) {
        const returnUrl = router.url;

        session.clearToken();

        if (!returnUrl.startsWith('/auth/login')) {
          void router.navigate(['/auth/login'], {
            queryParams: { returnUrl },
          });
        }
      }

      return throwError(() => error);
    }),
  );
};
