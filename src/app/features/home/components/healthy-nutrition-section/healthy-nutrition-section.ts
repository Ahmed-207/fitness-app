import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SfArrowIconComponent } from '../../../../shared/components/sf-arrow-icon/sf-arrow-icon.component';

interface MealPlan {
  id: number;
  image: string;
  titleKey: string;
  /** TheMealDB `filter.php?c=` category (matches /healthy tabs). */
  category: string;
}

@Component({
  selector: 'app-healthy-nutrition-section',
  imports: [RouterLink, TranslatePipe, SfArrowIconComponent],
  templateUrl: './healthy-nutrition-section.html',
})
export class HealthyNutritionSection {
  readonly meals = signal<MealPlan[]>([
    {
      id: 1,
      image: '/assets/healthy/Breakfast.jpg',
      titleKey: 'HEALTHY.MEALS.BREAKFAST',
      category: 'Breakfast',
    },
    {
      id: 2,
      image: '/assets/healthy/lunch.jpg',
      titleKey: 'HEALTHY.MEALS.LUNCH',
      category: 'Chicken',
    },
    {
      id: 3,
      image: '/assets/healthy/Dinner.jpg',
      titleKey: 'HEALTHY.MEALS.DINNER',
      category: 'Beef',
    },
  ]);
}
