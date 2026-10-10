import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AboutUsSectionComponent } from './components/about-us-section/about-us-section.component';
import { WhyUsSectionComponent } from './components/why-us-section/why-us-section.component';
import { MarqueeBannerComponent } from '../../shared/components/marquee-banner/marquee-banner';
import { WorkoutsSectionComponent } from './components/workouts-section/workouts-section';

@Component({
  selector: 'app-home',
  imports: [WhyUsSectionComponent, AboutUsSectionComponent, MarqueeBannerComponent, WorkoutsSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
