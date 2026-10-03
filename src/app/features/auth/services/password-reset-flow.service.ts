import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

const RESET_EMAIL_KEY = 'password_reset_email';

@Injectable({ providedIn: 'root' })
export class PasswordResetFlowService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly emailState = signal<string | null>(this.readEmail());

  readonly email = this.emailState.asReadonly();

  setEmail(email: string): void {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      this.clear();
      return;
    }

    this.emailState.set(normalizedEmail);
    if (this.isBrowser) {
      sessionStorage.setItem(RESET_EMAIL_KEY, normalizedEmail);
    }
  }

  clear(): void {
    this.emailState.set(null);
    if (this.isBrowser) {
      sessionStorage.removeItem(RESET_EMAIL_KEY);
    }
  }

  private readEmail(): string | null {
    return this.isBrowser ? sessionStorage.getItem(RESET_EMAIL_KEY) : null;
  }
}
