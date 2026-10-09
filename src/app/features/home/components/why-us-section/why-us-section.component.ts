import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface FitnessBenefit {
  readonly number: string;
  readonly titleKey: string;
  readonly descriptionKey: string;
}

@Component({
  selector: 'app-why-us-section',
  imports: [TranslatePipe],
  templateUrl: './why-us-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhyUsSectionComponent {
  protected readonly benefits: readonly FitnessBenefit[] = [
    {
      number: '01',
      titleKey: 'WHY_US.BENEFITS.PERSONALIZED.TITLE',
      descriptionKey: 'WHY_US.BENEFITS.PERSONALIZED.DESCRIPTION',
    },
    {
      number: '02',
      titleKey: 'WHY_US.BENEFITS.RESULTS.TITLE',
      descriptionKey: 'WHY_US.BENEFITS.RESULTS.DESCRIPTION',
    },
    {
      number: '03',
      titleKey: 'WHY_US.BENEFITS.EQUIPMENT.TITLE',
      descriptionKey: 'WHY_US.BENEFITS.EQUIPMENT.DESCRIPTION',
    },
  ];
}
