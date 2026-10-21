import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import {
  MealCategoriesResponse,
  MealCategory,
  MealDetail,
  MealDetailResponse,
  MealListResponse,
  MealSummary,
} from '../models/meals.models';

@Injectable({ providedIn: 'root' })
export class MealsService {
  private readonly http = inject(HttpClient);

  getCategories(): Observable<MealCategory[]> {
    return this.http
      .get<MealCategoriesResponse>(API_ENDPOINTS.meals.categories)
      .pipe(map((response) => response.categories ?? []));
  }

  getMealsByCategory(category: string): Observable<MealSummary[]> {
    const params = new HttpParams().set('c', category);
    return this.http
      .get<MealListResponse>(API_ENDPOINTS.meals.byCategory, { params })
      .pipe(map((response) => response.meals ?? []));
  }

  getMealDetails(idMeal: string): Observable<MealDetail | null> {
    const params = new HttpParams().set('i', idMeal);
    return this.http
      .get<MealDetailResponse>(API_ENDPOINTS.meals.details, { params })
      .pipe(map((response) => response.meals?.[0] ?? null));
  }
}
