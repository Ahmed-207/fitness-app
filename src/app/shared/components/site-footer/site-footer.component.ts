import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BrandLogoComponent } from '../brand-logo/brand-logo.component';
import { ServicesTickerComponent } from '../services-ticker/services-ticker.component';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [TranslatePipe, BrandLogoComponent, ServicesTickerComponent],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooterComponent {}
