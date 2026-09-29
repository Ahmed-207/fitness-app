import { API_ENDPOINTS } from '../constants/api-endpoints';

const PUBLIC_AUTH_ENDPOINTS = new Set<string>([
  API_ENDPOINTS.auth.signin,
  API_ENDPOINTS.auth.signup,
  API_ENDPOINTS.auth.forgotPassword,
  API_ENDPOINTS.auth.verifyResetCode,
  API_ENDPOINTS.auth.resetPassword,
]);

export function isPublicAuthRequest(url: string): boolean {
  return PUBLIC_AUTH_ENDPOINTS.has(url.split('?')[0]);
}
