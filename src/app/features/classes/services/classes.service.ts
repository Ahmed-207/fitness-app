import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import {
  Exercise,
  ExercisePageResponse,
  LevelsResponse,
  MuscleGroupDetailResponse,
  MuscleGroupsResponse,
  RandomExercisesResponse,
} from '../models/classes.models';

const EXERCISE_SEARCH_PAGE_SIZE = 500;

@Injectable({ providedIn: 'root' })
export class ClassesService {
  private readonly http = inject(HttpClient);

  getMuscleGroups(): Observable<MuscleGroupsResponse> {
    return this.http
      .get<MuscleGroupsResponse>(API_ENDPOINTS.muscles.groups)
      .pipe(map(trimMuscleGroupNames));
  }

  getLevels(): Observable<LevelsResponse> {
    return this.http.get<LevelsResponse>(API_ENDPOINTS.levels.all);
  }

  getMusclesByGroupId(groupId: string): Observable<MuscleGroupDetailResponse> {
    return this.http.get<MuscleGroupDetailResponse>(API_ENDPOINTS.muscles.byGroupId(groupId));
  }

  getExercises(page = 1, limit = 9): Observable<ExercisePageResponse> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<ExercisePageResponse>(API_ENDPOINTS.exercises.all, { params });
  }

  getRandomExercises(
    targetMuscleGroupId: string,
    difficultyLevelId: string,
    limit = 8,
  ): Observable<RandomExercisesResponse> {
    const params = new HttpParams()
      .set('targetMuscleGroupId', targetMuscleGroupId)
      .set('difficultyLevelId', difficultyLevelId)
      .set('limit', limit);
    return this.http.get<RandomExercisesResponse>(API_ENDPOINTS.exercises.random, { params });
  }

  /** Catalog has no single-exercise route; scan paginated list (≤6 requests at limit 500). */
  findExerciseById(id: string): Observable<Exercise | null> {
    return this.getExercises(1, EXERCISE_SEARCH_PAGE_SIZE).pipe(
      switchMap((firstPage) => {
        const match = firstPage.exercises.find((item) => item._id === id);
        if (match) {
          return of(match);
        }
        return this.findExerciseOnPage(id, 2, firstPage.totalPages);
      }),
    );
  }

  private findExerciseOnPage(
    id: string,
    page: number,
    totalPages: number,
  ): Observable<Exercise | null> {
    if (page > totalPages) {
      return of(null);
    }
    return this.getExercises(page, EXERCISE_SEARCH_PAGE_SIZE).pipe(
      switchMap((response) => {
        const match = response.exercises.find((item) => item._id === id);
        if (match) {
          return of(match);
        }
        return this.findExerciseOnPage(id, page + 1, totalPages);
      }),
    );
  }
}

/** Some muscle names in the API data include trailing spaces. */
function trimMuscleGroupNames(response: MuscleGroupsResponse): MuscleGroupsResponse {
  return {
    ...response,
    musclesGroup: response.musclesGroup.map((group) => ({
      ...group,
      name: group.name.trim(),
    })),
  };
}
