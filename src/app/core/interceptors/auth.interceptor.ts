import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { AuthSessionService } from '../services/auth-session.service';

const PUBLIC_AUTH_ENDPOINTS = new Set<string>([
  API_ENDPOINTS.auth.signin,
  API_ENDPOINTS.auth.signup,
  API_ENDPOINTS.auth.forgotPassword,
  API_ENDPOINTS.auth.verifyResetCode,
  API_ENDPOINTS.auth.resetPassword,
]);

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthSessionService).token();
  const isApplicationApiRequest = request.url.startsWith(environment.apiBaseUrl);
  const isPublicAuthRequest = PUBLIC_AUTH_ENDPOINTS.has(request.url.split('?')[0]);

  if (
    !token ||
    !isApplicationApiRequest ||
    isPublicAuthRequest ||
    request.headers.has('Authorization')
  ) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
