import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { ExercisesResponse, MuscleGroupsResponse } from '../models/workouts-models';

@Injectable({
  providedIn: 'root',
})
export class WorkoutsService {
  private readonly http = inject(HttpClient);

  getMuscleGroups(): Observable<MuscleGroupsResponse> {
    return this.http.get<MuscleGroupsResponse>(API_ENDPOINTS.muscles.groups);
  }

  getExercisesByMuscle(muscleGroupId?: string): Observable<ExercisesResponse> {
    let params = new HttpParams();
    if (muscleGroupId && muscleGroupId !== 'all') {
      params = params.set('muscleGroup', muscleGroupId);
    }
    return this.http.get<ExercisesResponse>(API_ENDPOINTS.exercises.all, { params });
  }
}
