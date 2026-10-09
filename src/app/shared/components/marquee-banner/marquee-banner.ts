import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-marquee-banner',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './marquee-banner.html',
  styleUrl: './marquee-banner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarqueeBannerComponent {
  items = [
    'MARQUEE.OUTDOOR_ONLINE',
    'MARQUEE.PERSONAL_TRAINING',
    'MARQUEE.LIVE_CLASSES',
    'MARQUEE.PERSONAL_TRAINERS',
  ];
}