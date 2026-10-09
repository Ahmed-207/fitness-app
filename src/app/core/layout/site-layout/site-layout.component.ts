import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteNavbarComponent } from '../../../shared/components/site-navbar/site-navbar.component';

@Component({
  selector: 'app-site-layout',
  imports: [RouterOutlet, SiteNavbarComponent],
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteLayoutComponent {}
