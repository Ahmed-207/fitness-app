import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AboutUsSectionComponent } from './components/about-us-section/about-us-section.component';
import { WhyUsSectionComponent } from './components/why-us-section/why-us-section.component';
import { HealthyNutritionSection } from './components/healthy-nutrition-section/healthy-nutrition-section';
import { MarqueeBannerComponent } from '../../shared/components/marquee-banner/marquee-banner';

@Component({
  selector: 'app-home',
  imports: [WhyUsSectionComponent, AboutUsSectionComponent, HealthyNutritionSection , MarqueeBannerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
