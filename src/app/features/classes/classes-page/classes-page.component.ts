import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, EMPTY, finalize, timeout } from 'rxjs';
import { SfArrowIconComponent } from '../../../shared/components/sf-arrow-icon/sf-arrow-icon.component';
import { VideoModalComponent } from '../../../shared/components/video-modal/video-modal.component';
import {
  Exercise,
  ExerciseCard,
  ExercisePageResponse,
  MuscleGroup,
} from '../models/classes.models';
import { ClassesService } from '../services/classes.service';
import { exerciseVideoUrl } from '../utils/exercise-media';

const PAGE_LIMIT = 24;
const SLIDE_SLOTS = 6;
const REQUEST_TIMEOUT_MS = 15000;

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop',
];

interface PlayingVideo {
  url: string;
  title: string;
}

@Component({
  selector: 'app-classes-page',
  imports: [RouterLink, TranslatePipe, SfArrowIconComponent, VideoModalComponent],
  templateUrl: './classes-page.component.html',
  styleUrl: './classes-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassesPageComponent implements OnInit {
  private readonly classesService = inject(ClassesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly muscleGroups = signal<MuscleGroup[]>([]);
  readonly selectedGroupId = signal<string>('all');
  readonly exercises = signal<ExerciseCard[]>([]);
  readonly currentPage = signal(0);
  readonly totalPages = signal(1);
  readonly isLoading = signal(false);
  readonly loadFailed = signal(false);
  readonly playing = signal<PlayingVideo | null>(null);
  readonly slideIndex = signal(0);

  readonly hasMore = computed(() => this.currentPage() < this.totalPages());

  readonly filteredExercises = computed(() => {
    const groupId = this.selectedGroupId();
    if (groupId === 'all') {
      return this.exercises();
    }
    const groupName = this.muscleGroups()
      .find((group) => group._id === groupId)
      ?.name.trim()
      .toLowerCase();
    if (!groupName) {
      return this.exercises();
    }
    const stem = groupName.replace(/s$/, '');
    return this.exercises().filter((card) => {
      const target = card.targetMuscleGroup.trim().toLowerCase();
      return target === groupName || target.includes(stem) || stem.includes(target);
    });
  });

  readonly pageCount = computed(() => {
    const total = this.filteredExercises().length;
    return Math.max(1, Math.ceil(total / SLIDE_SLOTS));
  });

  readonly pageIndexes = computed(() =>
    Array.from({ length: this.pageCount() }, (_, index) => index),
  );

  readonly visibleExercises = computed(() => {
    const items = this.filteredExercises();
    const start = this.slideIndex() * SLIDE_SLOTS;
    return items.slice(start, start + SLIDE_SLOTS);
  });

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.loadMuscleGroups();
    this.loadMore();
  }

  selectGroup(groupId: string): void {
    this.selectedGroupId.set(groupId);
    this.slideIndex.set(0);
  }

  goToSlide(index: number): void {
    const max = this.pageCount() - 1;
    this.slideIndex.set(Math.min(Math.max(index, 0), max));
  }

  loadMore(): void {
    if (this.isLoading() || !this.hasMore()) {
      return;
    }
    this.isLoading.set(true);
    this.classesService
      .getExercises(this.currentPage() + 1, PAGE_LIMIT)
      .pipe(
        timeout(REQUEST_TIMEOUT_MS),
        catchError(() => {
          this.loadFailed.set(true);
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => this.applyPage(response));
  }

  private applyPage(response: ExercisePageResponse): void {
    this.currentPage.set(response.currentPage);
    this.totalPages.set(Math.max(1, response.totalPages));
    this.exercises.update((cards) => [...cards, ...response.exercises.map(toExerciseCard)]);
  }

  play(card: ExerciseCard): void {
    if (!card.videoUrl) {
      return;
    }
    this.playing.set({ url: card.videoUrl, title: card.name });
  }

  closeVideo(): void {
    this.playing.set(null);
  }

  private loadMuscleGroups(): void {
    this.classesService
      .getMuscleGroups()
      .pipe(
        timeout(REQUEST_TIMEOUT_MS),
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        this.muscleGroups.set(response.musclesGroup);
      });
  }
}

function toExerciseCard(exercise: Exercise, index: number): ExerciseCard {
  return {
    id: exercise._id,
    name: exercise.exercise,
    targetMuscleGroup: exercise.target_muscle_group ?? '',
    image: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    videoUrl: exerciseVideoUrl(exercise),
    exercise,
  };
}
