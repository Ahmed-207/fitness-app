import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { isPublicAuthRequest } from '../auth/public-auth-request';
import { AuthSessionService } from '../services/auth-session.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthSessionService).token();
  const isApplicationApiRequest = request.url.startsWith(environment.apiBaseUrl);
  const isPublicAuth = isPublicAuthRequest(request.url);

  if (!token || !isApplicationApiRequest || isPublicAuth || request.headers.has('Authorization')) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
