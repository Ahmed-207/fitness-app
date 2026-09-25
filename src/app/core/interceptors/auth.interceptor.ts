import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthSessionService } from '../services/auth-session.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthSessionService).token();

  if (!token || request.headers.has('Authorization')) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
