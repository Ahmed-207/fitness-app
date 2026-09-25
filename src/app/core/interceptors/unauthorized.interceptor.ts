import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthSessionService } from '../services/auth-session.service';

export const unauthorizedInterceptor: HttpInterceptorFn = (request, next) => {
  const session = inject(AuthSessionService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
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
