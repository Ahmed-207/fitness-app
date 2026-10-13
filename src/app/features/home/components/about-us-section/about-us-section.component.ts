import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SfArrowIconComponent } from '../../../../shared/components/sf-arrow-icon/sf-arrow-icon.component';

interface GymFeature {
  readonly titleKey: string;
  readonly descriptionKey: string;
}

@Component({
  selector: 'app-about-us-section',
  imports: [TranslatePipe, SfArrowIconComponent],
  templateUrl: './about-us-section.component.html',
  styleUrl: './about-us-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsSectionComponent {
  protected readonly features: readonly GymFeature[] = [
    {
      titleKey: 'ABOUT_US.FEATURES.PERSONAL_TRAINER.TITLE',
      descriptionKey: 'ABOUT_US.FEATURES.PERSONAL_TRAINER.DESCRIPTION',
    },
    {
      titleKey: 'ABOUT_US.FEATURES.CARDIO.TITLE',
      descriptionKey: 'ABOUT_US.FEATURES.CARDIO.DESCRIPTION',
    },
    {
      titleKey: 'ABOUT_US.FEATURES.EQUIPMENT.TITLE',
      descriptionKey: 'ABOUT_US.FEATURES.EQUIPMENT.DESCRIPTION',
    },
    {
      titleKey: 'ABOUT_US.FEATURES.NUTRITION.TITLE',
      descriptionKey: 'ABOUT_US.FEATURES.NUTRITION.DESCRIPTION',
    },
  ];
}
