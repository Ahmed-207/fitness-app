import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration-success',
  imports: [RouterLink],
  templateUrl: './registration-success.component.html',
  styleUrl: './registration-success.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationSuccessComponent {}
