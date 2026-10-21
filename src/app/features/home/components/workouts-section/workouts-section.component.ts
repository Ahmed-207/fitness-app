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
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { WorkoutsService } from './../../../auth/services/workouts-service';
import { MuscleGroup, Exercise } from './../../../../features/auth/models/workouts-models';
import { SfArrowIconComponent } from '../../../../shared/components/sf-arrow-icon/sf-arrow-icon.component';

@Component({
  selector: 'app-workouts-section',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, SfArrowIconComponent],
  templateUrl: './workouts-section.component.html',
  styleUrl: './workouts-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutsSectionComponent implements OnInit {
  private workoutsService = inject(WorkoutsService);
  private destroyRef = inject(DestroyRef);
  private workoutsStarted = false;

  muscleGroups = signal<MuscleGroup[]>([]);
  allExercises = signal<any[]>([]);
  displayedExercises = signal<any[]>([]);
  selectedMuscleId = signal<string>('all');
  isLoading = signal<boolean>(false);

  readonly slideIndex = signal(0);
  readonly visibleSlots = signal(3);

  readonly pageCount = computed(() => {
    const total = this.displayedExercises().length;
    const slots = this.visibleSlots();
    return Math.max(1, Math.ceil(total / slots));
  });

  readonly pageIndexes = computed(() =>
    Array.from({ length: this.pageCount() }, (_, index) => index),
  );

  readonly visibleExercises = computed(() => {
    const items = this.displayedExercises();
    const slots = this.visibleSlots();
    const start = this.slideIndex() * slots;
    return items.slice(start, start + slots);
  });

  private fallbackImages = [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop'
  ];

  ngOnInit(): void {
    if (this.workoutsStarted) {
      return;
    }
    this.workoutsStarted = true;
    this.fetchMuscleGroups();
    this.fetchAllExercises();
  }

  fetchMuscleGroups(): void {
    this.workoutsService.getMuscleGroups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res && res.message === 'success' && res.musclesGroup && res.musclesGroup.length > 0) {
          this.muscleGroups.set(res.musclesGroup.slice(0, 6));
        } else {
          this.setDefaultMuscleGroups();
        }
      },
      error: () => this.setDefaultMuscleGroups()
    });
  }

  fetchAllExercises(): void {
    this.isLoading.set(true);
    this.workoutsService.getExercisesByMuscle().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res && res.message === 'success' && res.exercises && res.exercises.length > 0) {
          const processed = res.exercises.map((item: any, index: number) => ({
            ...item,
            name: item.exercise || item.name || 'WORKOUT',
            image: item.image || this.fallbackImages[index % this.fallbackImages.length]
          }));
          this.allExercises.set(processed);
          this.displayedExercises.set(processed);
          this.slideIndex.set(0);
        } else {
          this.setFallbackExercises();
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.setFallbackExercises();
        this.isLoading.set(false);
      }
    });
  }

  selectCategory(id: string): void {
    this.selectedMuscleId.set(id);
    this.slideIndex.set(0);

    if (id === 'all') {
      this.displayedExercises.set(this.allExercises());
      return;
    }

    const targetGroup = this.muscleGroups().find(g => g._id === id);
    const searchName = (targetGroup ? targetGroup.name : id).toLowerCase();

    const filtered = this.allExercises().filter(item => {
      const itemGroup = (item.muscleGroup || item.target_muscle_group || item.body_region || '').toLowerCase();
      return itemGroup.includes(searchName) || searchName.includes(itemGroup);
    });

    if (filtered.length > 0) {
      this.displayedExercises.set(filtered);
    } else {
      this.isLoading.set(true);
      this.workoutsService.getExercisesByMuscle(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          if (res && res.message === 'success' && res.exercises && res.exercises.length > 0) {
            const processed = res.exercises.map((item: any, index: number) => ({
              ...item,
              name: item.exercise || item.name || 'WORKOUT',
              image: item.image || this.fallbackImages[index % this.fallbackImages.length]
            }));
            this.displayedExercises.set(processed);
          } else {
            this.displayedExercises.set(this.allExercises().slice(0, 3));
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.displayedExercises.set(this.allExercises().slice(0, 3));
          this.isLoading.set(false);
        }
      });
    }
  }

  goToSlide(index: number): void {
    const max = this.pageCount() - 1;
    this.slideIndex.set(Math.min(Math.max(index, 0), max));
  }

  nextSlide(): void {
    const next = this.slideIndex() + 1;
    if (next < this.pageCount()) {
      this.slideIndex.set(next);
    } else {
      this.slideIndex.set(0); 
    }
  }

  prevSlide(): void {
    const prev = this.slideIndex() - 1;
    if (prev >= 0) {
      this.slideIndex.set(prev);
    } else {
      this.slideIndex.set(this.pageCount() - 1); 
    }
  }

  private setDefaultMuscleGroups(): void {
    this.muscleGroups.set([
      { _id: 'chest', name: 'Chest' },
      { _id: 'arm', name: 'Arm' },
      { _id: 'shoulders', name: 'Shoulders' },
      { _id: 'back', name: 'Back' },
      { _id: 'legs', name: 'Leg' },
      { _id: 'stomach', name: 'Stomach' }
    ]);
  }

  private setFallbackExercises(): void {
    const fallbackData = [
      { _id: '1', name: 'BENCH PRESS', image: this.fallbackImages[0] },
      { _id: '2', name: 'BARBELL CURLS', image: this.fallbackImages[1] },
      { _id: '3', name: 'SQUATS', image: this.fallbackImages[2] }
    ];
    this.allExercises.set(fallbackData);
    this.displayedExercises.set(fallbackData);
    this.slideIndex.set(0);
  }
}