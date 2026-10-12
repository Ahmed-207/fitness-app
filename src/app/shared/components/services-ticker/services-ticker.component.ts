import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-services-ticker',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './services-ticker.component.html',
  styleUrl: './services-ticker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesTickerComponent {
  readonly items = [
    'MARQUEE.OUTDOOR_ONLINE',
    'MARQUEE.PERSONAL_TRAINING',
    'MARQUEE.LIVE_CLASSES',
    'MARQUEE.PERSONAL_TRAINERS',
  ] as const;
}
