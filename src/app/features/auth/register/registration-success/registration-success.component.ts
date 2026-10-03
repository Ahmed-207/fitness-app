import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthBackButtonComponent } from '../../../../shared/components/auth/auth-back-button.component';

@Component({
  selector: 'app-registration-success',
  imports: [RouterLink, TranslatePipe, AuthBackButtonComponent],
  templateUrl: './registration-success.component.html',
  styleUrl: './registration-success.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationSuccessComponent {}
