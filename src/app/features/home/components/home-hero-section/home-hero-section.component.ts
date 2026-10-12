import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ServicesTickerComponent } from '../../../../shared/components/services-ticker/services-ticker.component';
import { SfArrowIconComponent } from '../../../../shared/components/sf-arrow-icon/sf-arrow-icon.component';

@Component({
  selector: 'app-home-hero-section',
  imports: [RouterLink, TranslatePipe, SfArrowIconComponent, ServicesTickerComponent],
  templateUrl: './home-hero-section.component.html',
  styleUrl: './home-hero-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHeroSectionComponent {
  readonly stats = [
    { valueKey: 'HOME.HERO.STATS.MEMBERS_VALUE', labelKey: 'HOME.HERO.STATS.MEMBERS_LABEL' },
    { valueKey: 'HOME.HERO.STATS.TRAINERS_VALUE', labelKey: 'HOME.HERO.STATS.TRAINERS_LABEL' },
    {
      valueKey: 'HOME.HERO.STATS.EXPERIENCE_VALUE',
      labelKey: 'HOME.HERO.STATS.EXPERIENCE_LABEL',
    },
  ] as const;
}
