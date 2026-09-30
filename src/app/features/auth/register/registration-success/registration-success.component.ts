import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-registration-success',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './registration-success.component.html',
  styleUrl: './registration-success.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationSuccessComponent {}
