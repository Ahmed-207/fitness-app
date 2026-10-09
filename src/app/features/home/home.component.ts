import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AboutUsSectionComponent } from './components/about-us-section/about-us-section.component';
import { WhyUsSectionComponent } from './components/why-us-section/why-us-section.component';

@Component({
  selector: 'app-home',
  imports: [WhyUsSectionComponent, AboutUsSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
