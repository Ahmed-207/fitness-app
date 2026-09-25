import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, computed, inject, Injectable, signal } from '@angular/core';

const ACCESS_TOKEN_KEY = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly tokenState = signal<string | null>(this.readStoredToken());

  readonly token = this.tokenState.asReadonly();
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

  clearToken(): void {
    this.tokenState.set(null);

    if (this.isBrowser) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  }

  private readStoredToken(): string | null {
    return this.isBrowser ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
  }
}
