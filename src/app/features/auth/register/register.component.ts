import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AccountCredentials } from './account-credentials';
import { AccountFormComponent } from './account-form/account-form.component';
import { OnboardingComponent } from '../onboarding/onboarding.component';
import { RegistrationSuccessComponent } from './registration-success/registration-success.component';

type RegisterPhase = 'account' | 'onboarding' | 'success';

@Component({
  selector: 'app-register',
  imports: [AccountFormComponent, OnboardingComponent, RegistrationSuccessComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  readonly phase = signal<RegisterPhase>('account');
  readonly account = signal<AccountCredentials | null>(null);

  startOnboarding(credentials: AccountCredentials): void {
    this.account.set(credentials);
    this.phase.set('onboarding');
  }

  showAccount(): void {
    this.phase.set('account');
  }

  showSuccess(): void {
    this.phase.set('success');
  }
}
