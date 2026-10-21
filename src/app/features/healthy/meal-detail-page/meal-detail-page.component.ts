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
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, combineLatest, EMPTY, finalize, forkJoin, map, of, switchMap } from 'rxjs';
import {
  DEFAULT_MEAL_TAB_ID,
  MEAL_TABS,
  categoryForTabId,
  mealTabForCategory,
} from '../models/meal-tabs';
import {
  MealDetail,
  MealSummary,
  extractIngredients,
} from '../models/meals.models';
import { MealsService } from '../services/meals.service';

@Component({
  selector: 'app-meal-detail-page',
  imports: [TranslatePipe],
  templateUrl: './meal-detail-page.component.html',
  styleUrl: './meal-detail-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealDetailPageComponent implements OnInit {
  private readonly mealsService = inject(MealsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly mealTabs = MEAL_TABS;
  readonly selectedTabId = signal<string>(DEFAULT_MEAL_TAB_ID);
  readonly activeMealId = signal<string | null>(null);
  readonly sidebarMeals = signal<MealSummary[]>([]);
  readonly meal = signal<MealDetail | null>(null);
  readonly isLoading = signal(true);
  readonly loadFailed = signal(false);
  readonly notFound = signal(false);

  readonly ingredients = computed(() => {
    const current = this.meal();
    return current ? extractIngredients(current) : [];
  });

  readonly description = computed(() => {
    const text = this.meal()?.strInstructions?.trim() ?? '';
    if (text.length <= 280) {
      return text;
    }
    return `${text.slice(0, 277).trimEnd()}…`;
  });

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(
        map(([params, query]) => ({
          mealId: params.get('mealId'),
          category: query.get('c'),
        })),
        switchMap(({ mealId, category }) => {
          this.selectedTabId.set(mealTabForCategory(category));
          this.activeMealId.set(mealId);
          this.loadFailed.set(false);
          this.notFound.set(false);

          if (!mealId) {
            this.isLoading.set(false);
            this.notFound.set(true);
            return EMPTY;
          }

          const tabCategory = categoryForTabId(this.selectedTabId());
          this.isLoading.set(true);

          return forkJoin({
            list: this.mealsService.getMealsByCategory(tabCategory).pipe(catchError(() => of(null))),
            detail: this.mealsService.getMealDetails(mealId).pipe(catchError(() => of(null))),
          }).pipe(
            finalize(() => this.isLoading.set(false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (!result) {
          return;
        }

        const { list, detail } = result;
        if (list === null || detail === null) {
          this.loadFailed.set(true);
          this.sidebarMeals.set(list ?? []);
          this.meal.set(detail);
          this.notFound.set(!detail);
          return;
        }

        this.sidebarMeals.set(list);
        if (!detail) {
          this.meal.set(null);
          this.notFound.set(true);
          return;
        }

        this.meal.set(detail);
        this.notFound.set(false);
      });
  }

  selectTab(tabId: string): void {
    const tab = MEAL_TABS.find((item) => item.id === tabId);
    if (!tab) {
      return;
    }
    this.selectedTabId.set(tabId);
    this.loadMealsForCategory(tab.category);
  }

  selectMeal(summary: MealSummary): void {
    void this.router.navigate(['/healthy', summary.idMeal], {
      queryParams: { c: categoryForTabId(this.selectedTabId()) },
    });
  }

  isSelected(item: MealSummary): boolean {
    return item.idMeal === this.activeMealId();
  }

  private loadMealsForCategory(category: string): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { c: category },
      replaceUrl: true,
    });

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
      .subscribe((meals) => {
        this.sidebarMeals.set(meals);
        const currentId = this.activeMealId();
        const stillVisible = meals.some((item) => item.idMeal === currentId);
        if (!stillVisible && meals[0]) {
          this.selectMeal(meals[0]);
        }
      });
  }
}
