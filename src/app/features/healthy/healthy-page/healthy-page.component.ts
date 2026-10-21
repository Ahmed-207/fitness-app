import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, EMPTY, finalize } from 'rxjs';
import { SfArrowIconComponent } from '../../../shared/components/sf-arrow-icon/sf-arrow-icon.component';
import {
  DEFAULT_MEAL_TAB_ID,
  MEAL_TABS,
  categoryForTabId,
  mealTabForCategory,
} from '../models/meal-tabs';
import { MealSummary } from '../models/meals.models';
import { MealsService } from '../services/meals.service';

const SLIDE_SLOTS = 6;

@Component({
  selector: 'app-healthy-page',
  imports: [RouterLink, TranslatePipe, SfArrowIconComponent],
  templateUrl: './healthy-page.component.html',
  styleUrl: './healthy-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthyPageComponent implements OnInit {
  private readonly mealsService = inject(MealsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly mealTabs = MEAL_TABS;
  readonly selectedTabId = signal<string>(DEFAULT_MEAL_TAB_ID);
  readonly meals = signal<MealSummary[]>([]);
  readonly isLoading = signal(false);
  readonly loadFailed = signal(false);
  readonly slideIndex = signal(0);

  readonly selectedCategory = computed(() => categoryForTabId(this.selectedTabId()));

  readonly pageCount = computed(() => {
    const total = this.meals().length;
    return Math.max(1, Math.ceil(total / SLIDE_SLOTS));
  });

  readonly pageIndexes = computed(() =>
    Array.from({ length: this.pageCount() }, (_, index) => index),
  );

  readonly visibleMeals = computed(() => {
    const items = this.meals();
    const start = this.slideIndex() * SLIDE_SLOTS;
    return items.slice(start, start + SLIDE_SLOTS);
  });

  ngOnInit(): void {
    const fromQuery = this.route.snapshot.queryParamMap.get('c');
    const tabId = mealTabForCategory(fromQuery);
    this.selectedTabId.set(tabId);
    this.loadMeals(categoryForTabId(tabId), false);
  }

  selectTab(tabId: string): void {
    const tab = MEAL_TABS.find((item) => item.id === tabId);
    if (!tab) {
      return;
    }
    this.selectedTabId.set(tabId);
    this.slideIndex.set(0);
    this.loadMeals(tab.category, true);
  }

  goToSlide(index: number): void {
    const max = this.pageCount() - 1;
    this.slideIndex.set(Math.min(Math.max(index, 0), max));
  }

  mealLink(meal: MealSummary): string[] {
    return ['/healthy', meal.idMeal];
  }

  mealQueryParams(): { c: string } {
    return { c: this.selectedCategory() };
  }

  private loadMeals(category: string, syncQuery: boolean): void {
    if (syncQuery) {
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { c: category },
        replaceUrl: true,
      });
    }

    this.isLoading.set(true);
    this.loadFailed.set(false);
    this.mealsService
      .getMealsByCategory(category)
      .pipe(
        catchError(() => {
          this.loadFailed.set(true);
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((meals) => this.meals.set(meals));
  }
}
