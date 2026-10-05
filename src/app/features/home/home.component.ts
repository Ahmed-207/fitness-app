import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, EMPTY, finalize } from 'rxjs';
import { AuthSessionService } from '../../core/services/auth-session.service';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly auth = inject(AuthService);
  private readonly session = inject(AuthSessionService);
  private readonly router = inject(Router);

  readonly isSigningOut = signal(false);

  readonly displayName = computed(() => {
    const user = this.session.user();
    if (!user) {
      return '';
    }
    return `${user.firstName} ${user.lastName}`.trim();
  });

  readonly email = computed(() => this.session.user()?.email ?? '');

  signOut(): void {
    if (this.isSigningOut()) {
      return;
    }

    this.isSigningOut.set(true);
    this.auth
      .signOut()
      .pipe(
        catchError(() => {
          this.auth.clearSession();
          return EMPTY;
        }),
        finalize(() => this.isSigningOut.set(false)),
      )
      .subscribe(() => void this.router.navigate(['/auth/login']));
  }
}
