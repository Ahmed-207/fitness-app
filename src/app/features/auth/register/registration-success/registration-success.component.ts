import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

const REDIRECT_DELAY_MS = 2200;

@Component({
  selector: 'app-registration-success',
  imports: [TranslatePipe],
  templateUrl: './registration-success.component.html',
  styleUrl: './registration-success.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationSuccessComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const timeoutId = window.setTimeout(() => this.goToLogin(), REDIRECT_DELAY_MS);
    this.destroyRef.onDestroy(() => clearTimeout(timeoutId));
  }

  private goToLogin(): void {
    this.auth.clearSession();
    void this.router.navigate(['/auth/login']);
  }
}
