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
import { TranslatePipe } from '@ngx-translate/core';
import { WorkoutsService } from '../../../auth/services/workouts-service';
import { Exercise, MuscleGroup } from '../../../auth/models/workouts-models';
import { SfArrowIconComponent } from '../../../../shared/components/sf-arrow-icon/sf-arrow-icon.component';

const CATEGORY_KEYS = [
  'FULL_BODY',
  'CHEST',
  'ARM',
  'SHOULDER',
  'BACK',
  'LEGS',
  'STOMACH',
] as const;

@Component({
  selector: 'app-workouts-section',
  imports: [TranslatePipe, SfArrowIconComponent],
  templateUrl: './workouts-section.component.html',
  styleUrl: './workouts-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutsSectionComponent implements OnInit {
  private readonly workoutsService = inject(WorkoutsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categoryKeys = CATEGORY_KEYS;
  readonly muscleGroups = signal<MuscleGroup[]>([]);
  readonly displayedExercises = signal<Exercise[]>([]);
  readonly selectedMuscleId = signal<string>('all');
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

  ngOnInit(): void {
    this.initViewportLayout();
    this.loadInitialData();
  }

  private initViewportLayout(): void {
    this.updateVisibleSlots();
    this.registerResizeListener();
  }

  private registerResizeListener(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const onResize = () => this.updateVisibleSlots();
    window.addEventListener('resize', onResize);
    this.destroyRef.onDestroy(() => window.removeEventListener('resize', onResize));
  }

  private loadInitialData(): void {
    this.fetchMuscleGroups();
    this.fetchExercises();
  }

  selectCategory(id: string): void {
    this.selectedMuscleId.set(id);
    this.slideIndex.set(0);
    this.fetchExercises(id === 'all' ? undefined : id);
  }

  goToSlide(index: number): void {
    const max = this.pageCount() - 1;
    this.slideIndex.set(Math.min(Math.max(index, 0), max));
  }

  private updateVisibleSlots(): void {
    if (typeof window === 'undefined') {
      return;
    }
    const width = window.innerWidth;
    if (width >= 1200) {
      this.visibleSlots.set(3);
    } else if (width >= 768) {
      this.visibleSlots.set(2);
    } else {
      this.visibleSlots.set(1);
    }
    const max = this.pageCount() - 1;
    if (this.slideIndex() > max) {
      this.slideIndex.set(max);
    }
  }

  private fetchMuscleGroups(): void {
    this.workoutsService
      .getMuscleGroups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res?.message === 'success' && res.musclesGroup?.length) {
            this.muscleGroups.set(res.musclesGroup.slice(0, 6));
          }
        },
        error: () => {
          /* categories fall back to i18n keys */
        },
      });
  }

  private fetchExercises(muscleGroupId?: string): void {
    this.workoutsService
      .getExercisesByMuscle(muscleGroupId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res?.message === 'success' && res.exercises?.length) {
            this.displayedExercises.set(res.exercises);
          } else {
            this.setFallbackExercises();
          }
        },
        error: () => this.setFallbackExercises(),
      });
  }

  private setFallbackExercises(): void {
    this.displayedExercises.set([
      {
        _id: '1',
        name: 'GROUP WORKOUT',
        image:
          'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop',
      },
      {
        _id: '2',
        name: 'PERSONAL TRAINING',
        image:
          'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop',
      },
      {
        _id: '3',
        name: 'MUSCLE BUILDING',
        image:
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop',
      },
    ]);
  }
}
