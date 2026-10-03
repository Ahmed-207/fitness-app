import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, computed, inject, Injectable, signal } from '@angular/core';
import type { AuthUser } from '../auth/auth-user';

const ACCESS_TOKEN_KEY = 'access_token';
const AUTH_USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly tokenState = signal<string | null>(this.readStoredToken());
  private readonly userState = signal<AuthUser | null>(this.readStoredUser());

  readonly token = this.tokenState.asReadonly();
  readonly user = this.userState.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.tokenState()));

  setToken(token: string): void {
    const normalizedToken = token.trim();

    if (!normalizedToken) {
      this.clearToken();
      return;
    }

    this.tokenState.set(normalizedToken);

    if (this.isBrowser) {
      localStorage.setItem(ACCESS_TOKEN_KEY, normalizedToken);
    }
  }

  setUser(user: AuthUser): void {
    this.userState.set(user);

    if (this.isBrowser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    }
  }

  clearToken(): void {
    this.tokenState.set(null);

    if (this.isBrowser) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  }

  clearSession(): void {
    this.clearToken();
    this.userState.set(null);

    if (this.isBrowser) {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }

  private readStoredToken(): string | null {
    return this.isBrowser ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
  }

  private readStoredUser(): AuthUser | null {
    if (!this.isBrowser) {
      return null;
    }

    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    if (!storedUser) {
      return null;
    }

    try {
      const user: unknown = JSON.parse(storedUser);
      return this.isAuthUser(user) ? user : null;
    } catch {
      localStorage.removeItem(AUTH_USER_KEY);
      return null;
    }
  }

  private isAuthUser(value: unknown): value is AuthUser {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const user = value as Partial<AuthUser>;
    return (
      typeof user._id === 'string' &&
      typeof user.firstName === 'string' &&
      typeof user.lastName === 'string' &&
      typeof user.email === 'string'
    );
  }
}
