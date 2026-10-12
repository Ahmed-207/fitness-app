import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AboutUsSectionComponent } from './components/about-us-section/about-us-section.component';
import { HealthyNutritionSection } from './components/healthy-nutrition-section/healthy-nutrition-section';
import { HomeHeroSectionComponent } from './components/home-hero-section/home-hero-section.component';
import { WhyUsSectionComponent } from './components/why-us-section/why-us-section.component';

@Component({
  selector: 'app-home',
  imports: [
    HomeHeroSectionComponent,
    AboutUsSectionComponent,
    WhyUsSectionComponent,
    HealthyNutritionSection,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
