import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  private readonly messageState = signal<string | null>(null);

  readonly message = this.messageState.asReadonly();

  set(message: string): void {
    this.messageState.set(message);
  }

  clear(): void {
    this.messageState.set(null);
  }
}
