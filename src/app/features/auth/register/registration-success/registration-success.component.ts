import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthBackButtonComponent } from '../../../../shared/components/auth/auth-back-button.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration-success',
  imports: [TranslatePipe, AuthBackButtonComponent],
  templateUrl: './registration-success.component.html',
  styleUrl: './registration-success.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationSuccessComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  continueToLogin(): void {
    this.auth.clearSession();
    void this.router.navigate(['/auth/login']);
  }
}
