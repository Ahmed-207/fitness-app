import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface MealPlan {
  id: number;
  image: string;
  titleKey: string;
}

@Component({
  selector: 'app-healthy-nutrition-section',
  imports: [TranslatePipe],
  templateUrl: './healthy-nutrition-section.html'
})

export class HealthyNutritionSection {
  readonly meals = signal<MealPlan[]>([
     {
      id: 1,
      image: '/assets/healthy/Breakfast.jpg',
      titleKey: 'HEALTHY.MEALS.BREAKFAST'
      },
      {
        id: 2,
        image: '/assets/healthy/lunch.jpg',
        titleKey: 'HEALTHY.MEALS.LUNCH'
      },
      {
        id: 3,
        image: '/assets/healthy/Dinner.jpg',
        titleKey: 'HEALTHY.MEALS.DINNER'
      }
    ]);
}
