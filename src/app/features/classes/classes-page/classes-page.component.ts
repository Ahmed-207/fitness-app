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
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, EMPTY, finalize, map, switchMap, timeout } from 'rxjs';
import { SfArrowIconComponent } from '../../../shared/components/sf-arrow-icon/sf-arrow-icon.component';
import { VideoModalComponent } from '../../../shared/components/video-modal/video-modal.component';
import {
  Exercise,
  ExerciseCard,
  ExercisePageResponse,
  Level,
  MuscleGroup,
  PlayingVideo,
  RandomExercisesResponse,
} from '../models/classes.models';
import { ClassesService } from '../services/classes.service';
import { exerciseImageUrl, exerciseVideoUrl, PrimeMoverImageMap } from '../utils/exercise-media';

const PAGE_LIMIT = 24;
const SLIDE_SLOTS = 6;
const REQUEST_TIMEOUT_MS = 15000;
const DEFAULT_DIFFICULTY_NAME = 'Beginner';

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
  private catalogStarted = false;

  readonly muscleGroups = signal<MuscleGroup[]>([]);
  readonly levels = signal<Level[]>([]);
  readonly selectedGroupId = signal<string>('all');
  readonly exercises = signal<ExerciseCard[]>([]);
  readonly currentPage = signal(0);
  readonly totalPages = signal(1);
  readonly isLoading = signal(false);
  readonly loadFailed = signal(false);
  readonly playing = signal<PlayingVideo | null>(null);
  readonly slideIndex = signal(0);

  /** Prime mover used for `GET /exercises/by-muscle-difficulty` when a muscle group tab is active. */
  private readonly activePrimeMoverId = signal<string | null>(null);
  private readonly primeMoverImages = signal<PrimeMoverImageMap>(new Map());

  readonly hasMore = computed(() => this.currentPage() < this.totalPages());

  readonly pageCount = computed(() => {
    const total = this.exercises().length;
    return Math.max(1, Math.ceil(total / SLIDE_SLOTS));
  });

  readonly pageIndexes = computed(() =>
    Array.from({ length: this.pageCount() }, (_, index) => index),
  );

  readonly visibleExercises = computed(() => {
    const items = this.exercises();
    const start = this.slideIndex() * SLIDE_SLOTS;
    return items.slice(start, start + SLIDE_SLOTS);
  });

  ngOnInit(): void {
    this.initCatalog();
  }

  /** Loads Elevate catalog; safe to call from tests. Skips duplicate runs per component instance. */
  initCatalog(): void {
    if (this.catalogStarted) {
      return;
    }
    this.catalogStarted = true;
    this.loadMuscleGroups();
    this.loadLevels();
    this.loadPrimeMoverImages();
    this.loadMore();
  }

  selectGroup(groupId: string): void {
    this.selectedGroupId.set(groupId);
    this.slideIndex.set(0);
    this.exercises.set([]);
    this.currentPage.set(0);
    this.totalPages.set(1);
    this.activePrimeMoverId.set(null);
    this.loadFailed.set(false);

    if (groupId === 'all') {
      this.loadMore();
      return;
    }
    this.loadGroupExercises(1);
  }

  goToSlide(index: number): void {
    const max = this.pageCount() - 1;
    this.slideIndex.set(Math.min(Math.max(index, 0), max));
  }

  loadMore(): void {
    if (this.selectedGroupId() !== 'all') {
      return;
    }
    if (this.isLoading() || !this.hasMore()) {
      return;
    }
    this.fetchExercisePage(this.currentPage() + 1, (page) =>
      this.classesService.getExercises(page, PAGE_LIMIT),
    );
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

  private loadPrimeMoverImages(): void {
    this.classesService
      .getPrimeMoverImageMap()
      .pipe(
        timeout(REQUEST_TIMEOUT_MS),
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((map) => {
        this.primeMoverImages.set(map);
        this.refreshExerciseCardImages();
      });
  }

  private loadLevels(): void {
    this.classesService
      .getLevels()
      .pipe(
        timeout(REQUEST_TIMEOUT_MS),
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => this.levels.set(response.levels));
  }

  private loadGroupExercises(page: number): void {
    const groupId = this.selectedGroupId();
    if (groupId === 'all') {
      return;
    }

    const levelId = this.defaultDifficultyLevelId();
    if (!levelId) {
      this.loadFailed.set(true);
      return;
    }

    this.isLoading.set(true);
    const primeMoverId = this.activePrimeMoverId();

    const request$ =
      primeMoverId !== null
        ? this.classesService.getExercisesByMuscleAndDifficulty(
            primeMoverId,
            levelId,
            page,
            PAGE_LIMIT,
          )
        : this.classesService.getPrimeMoversByMuscleGroup(groupId).pipe(
            switchMap((response) => {
              const first = response.muscles[0];
              if (!first) {
                return this.classesService
                  .getRandomExercises(groupId, levelId, PAGE_LIMIT)
                  .pipe(map(randomToExercisePage));
              }
              this.activePrimeMoverId.set(first._id);
              return this.classesService.getExercisesByMuscleAndDifficulty(
                first._id,
                levelId,
                page,
                PAGE_LIMIT,
              );
            }),
          );

    request$
      .pipe(
        timeout(REQUEST_TIMEOUT_MS),
        catchError(() => {
          this.loadFailed.set(true);
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => this.applyPage(response, page === 1));
  }

  private fetchExercisePage(
    page: number,
    loader: (page: number) => ReturnType<ClassesService['getExercises']>,
  ): void {
    this.isLoading.set(true);
    loader(page)
      .pipe(
        timeout(REQUEST_TIMEOUT_MS),
        catchError(() => {
          this.loadFailed.set(true);
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => this.applyPage(response, page === 1));
  }

  private applyPage(response: ExercisePageResponse, replace: boolean): void {
    this.currentPage.set(response.currentPage);
    this.totalPages.set(Math.max(1, response.totalPages));
    const mapped = response.exercises.map((exercise) =>
      toExerciseCard(exercise, this.primeMoverImages()),
    );
    if (replace) {
      this.exercises.set(mapped);
      this.slideIndex.set(0);
      return;
    }
    this.exercises.update((cards) => [...cards, ...mapped]);
  }

  private refreshExerciseCardImages(): void {
    const images = this.primeMoverImages();
    if (images.size === 0 || this.exercises().length === 0) {
      return;
    }
    this.exercises.update((cards) =>
      cards.map((card, index) => ({
        ...card,
        image: exerciseImageUrl(card.exercise, images),
      })),
    );
  }

  private defaultDifficultyLevelId(): string | null {
    const levels = this.levels();
    const preferred = levels.find((level) => level.name.trim() === DEFAULT_DIFFICULTY_NAME);
    return preferred?._id ?? levels[0]?._id ?? null;
  }
}

function randomToExercisePage(random: RandomExercisesResponse): ExercisePageResponse {
  return {
    message: random.message,
    totalExercises: random.totalExercises,
    totalPages: 1,
    currentPage: 1,
    exercises: random.exercises,
  };
}

function toExerciseCard(exercise: Exercise, primeMoverImages: PrimeMoverImageMap): ExerciseCard {
  return {
    id: exercise._id,
    name: exercise.exercise,
    targetMuscleGroup: exercise.target_muscle_group ?? '',
    image: exerciseImageUrl(exercise, primeMoverImages),
    videoUrl: exerciseVideoUrl(exercise),
    exercise,
  };
}
