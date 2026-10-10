import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { WorkoutsService } from './../../../auth/services/workouts-service';
import { MuscleGroup, Exercise } from './../../../../features/auth/models/workouts-models';


@Component({
  selector: 'app-workouts-section',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './workouts-section.html',
  styleUrl: './workouts-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutsSectionComponent implements OnInit {
  private workoutsService = inject(WorkoutsService);

  muscleGroups = signal<MuscleGroup[]>([]);
  allExercises = signal<Exercise[]>([]);
  displayedExercises = signal<Exercise[]>([]);
  selectedMuscleId = signal<string>('all');
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.fetchMuscleGroups();
    this.fetchAllExercises();
  }
  fetchMuscleGroups(): void {
  this.workoutsService.getMuscleGroups().subscribe({
    next: (res) => {
      if (res && res.message === 'success' && res.musclesGroup && res.musclesGroup.length > 0) {
       
        this.muscleGroups.set(res.musclesGroup.slice(0, 6));
      } else {
        this.setDefaultMuscleGroups();
      }
    },
    error: (err) => {
      console.error('Error fetching muscle groups:', err);
      this.setDefaultMuscleGroups();
    }
  });
}

  fetchAllExercises(): void {
    this.isLoading.set(true);
    this.workoutsService.getExercisesByMuscle().subscribe({
      next: (res) => {
        if (res && res.message === 'success' && res.exercises && res.exercises.length > 0) {
          this.allExercises.set(res.exercises);
          this.displayedExercises.set(res.exercises);
        } else {
          this.setFallbackExercises();
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching exercises:', err);
        this.setFallbackExercises();
        this.isLoading.set(false);
      }
    });
  }

  selectCategory(id: string): void {
    this.selectedMuscleId.set(id);
    this.isLoading.set(true);

    this.workoutsService.getExercisesByMuscle(id === 'all' ? undefined : id).subscribe({
      next: (res) => {
        if (res && res.message === 'success' && res.exercises && res.exercises.length > 0) {
          this.displayedExercises.set(res.exercises);
        } else {
          this.filterLocalExercises(id);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error filtering exercises:', err);
        this.filterLocalExercises(id);
        this.isLoading.set(false);
      }
    });
  }

  private filterLocalExercises(muscleId: string): void {
    if (muscleId === 'all') {
      this.displayedExercises.set(this.allExercises());
    } else {
      const muscleObj = this.muscleGroups().find(g => g._id === muscleId);
      const muscleName = muscleObj ? muscleObj.name.toLowerCase() : '';

      const filtered = this.allExercises().filter(item => 
        item.muscleGroup === muscleId || 
        (item.muscleGroup && item.muscleGroup.toLowerCase() === muscleName)
      );

      this.displayedExercises.set(filtered.length > 0 ? filtered : this.allExercises().slice(0, 3));
    }
  }

  private setDefaultMuscleGroups(): void {
    this.muscleGroups.set([
      { _id: '69d982ed85f6bfa972bf2220', name: 'Chest' },
      { _id: '69d982ee85f6bfa972bf222c', name: 'Arm' },
      { _id: '69d982ed85f6bfa972bf2224', name: 'Shoulders' },
      { _id: '69d982ee85f6bfa972bf2226', name: 'Back' },
      { _id: '69d982ee85f6bfa972bf222e', name: 'Leg' },
      { _id: '69d982ee85f6bfa972bf2232', name: 'Stomach' }
    ]);
  }

  private setFallbackExercises(): void {
    const fallbackData: Exercise[] = [
      {
        _id: '1',
        name: 'BENCH PRESS',
        muscleGroup: '69d982ed85f6bfa972bf2220',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop'
      },
      {
        _id: '2',
        name: 'BARBELL CURLS',
        muscleGroup: '69d982ee85f6bfa972bf222c',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop'
      },
      {
        _id: '3',
        name: 'SQUATS',
        muscleGroup: '69d982ee85f6bfa972bf222e',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop'
      }
    ];
    this.allExercises.set(fallbackData);
    this.displayedExercises.set(fallbackData);
  }
}