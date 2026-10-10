import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MuscleGroupsResponse, ExercisesResponse } from './../../../features/auth/models/workouts-models';

@Injectable({
  providedIn: 'root'
})
export class WorkoutsService {
  private http = inject(HttpClient);
  private baseUrl = 'https://fitness.elevateegy.com/api/v1';

  getMuscleGroups(): Observable<MuscleGroupsResponse> {
    return this.http.get<MuscleGroupsResponse>(`${this.baseUrl}/muscles`);
  }

  getExercisesByMuscle(muscleGroupId?: string): Observable<ExercisesResponse> {
    let params = new HttpParams();
    if (muscleGroupId && muscleGroupId !== 'all') {
      params = params.set('muscleGroup', muscleGroupId);
    }
    return this.http.get<ExercisesResponse>(`${this.baseUrl}/exercises, { params }`);
  }
}