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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, EMPTY, finalize, forkJoin, of, timeout } from 'rxjs';
import { SfArrowIconComponent } from '../../../shared/components/sf-arrow-icon/sf-arrow-icon.component';
import { VideoModalComponent } from '../../../shared/components/video-modal/video-modal.component';
import { MealCategory } from '../../healthy/models/meals.models';
import { MealsService } from '../../healthy/services/meals.service';
import {
  DifficultyLevelRef,
  Exercise,
  Level,
  MuscleGroup,
  PrimeMoverMuscle,
} from '../models/classes.models';
import { ClassesService } from '../services/classes.service';
import { exerciseImageUrl, exerciseVideoUrl, PrimeMoverImageMap } from '../utils/exercise-media';

const REQUEST_TIMEOUT_MS = 15000;
const SIDEBAR_LIMIT = 8;

export type DifficultyTab = 'Beginner' | 'Intermediate' | 'Advanced';

const DIFFICULTY_ORDER: DifficultyTab[] = ['Beginner', 'Intermediate', 'Advanced'];

const RECOMMENDED_MEALS = [
  {
    id: 'breakfast',
    titleKey: 'HEALTHY.MEALS.BREAKFAST',
    category: 'Breakfast',
    image: '/assets/healthy/Breakfast.jpg',
  },
  {
    id: 'lunch',
    titleKey: 'HEALTHY.MEALS.LUNCH',
    category: 'Chicken',
    image: '/assets/healthy/lunch.jpg',
  },
  {
    id: 'dinner',
    titleKey: 'HEALTHY.MEALS.DINNER',
    category: 'Beef',
    image: '/assets/healthy/Dinner.jpg',
  },
] as const;

interface PlayingVideo {
  url: string;
  title: string;
}

interface ExerciseState {
  exercise?: Exercise;
}

interface DetailHighlight {
  labelKey: string;
  value: string;
}

@Component({
  selector: 'app-class-details-page',
  imports: [RouterLink, TranslatePipe, SfArrowIconComponent, VideoModalComponent],
  templateUrl: './class-details-page.component.html',
  styleUrl: './class-details-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassDetailsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly classesService = inject(ClassesService);
  private readonly mealsService = inject(MealsService);
  private readonly destroyRef = inject(DestroyRef);
  private detailStarted = false;

  readonly recommendedMeals = RECOMMENDED_MEALS;

  readonly muscleGroups = signal<MuscleGroup[]>([]);
  readonly levels = signal<Level[]>([]);
  readonly levelsForPrimeMover = signal<DifficultyLevelRef[]>([]);
  readonly primeMovers = signal<PrimeMoverMuscle[]>([]);
  readonly selectedGroupId = signal<string>('all');
  readonly selectedDifficulty = signal<DifficultyTab>('Beginner');
  readonly sidebarExercises = signal<Exercise[]>([]);
  readonly exercise = signal<Exercise | null>(null);
  readonly notFound = signal(false);
  readonly isLoading = signal(true);
  readonly categories = signal<MealCategory[]>([]);
  readonly playing = signal<PlayingVideo | null>(null);
  private readonly primeMoverImages = signal<PrimeMoverImageMap>(new Map());

  readonly difficultyTabs = computed(() => {
    const names =
      this.levelsForPrimeMover().length > 0
        ? this.levelsForPrimeMover().map((level) => level.name.trim())
        : this.levels().map((level) => level.name.trim());
    const available = new Set(names);
    const tabs = DIFFICULTY_ORDER.filter((name) => available.has(name));
    return tabs.length > 0 ? tabs : DIFFICULTY_ORDER;
  });

  readonly heroTitle = computed(() => {
    const current = this.exercise();
    if (!current) {
      return '';
    }
    const group = current.target_muscle_group?.trim();
    return group ? `${group} Exercise` : current.exercise;
  });

  readonly heroDescription = computed(() => {
    const current = this.exercise();
    if (!current) {
      return '';
    }
    return [
      current.difficulty_level,
      current.target_muscle_group,
      current.prime_mover_muscle,
      current.primary_exercise_classification,
    ]
      .map((part) => part?.trim())
      .filter((part): part is string => Boolean(part))
      .join(' · ');
  });

  readonly detailHighlights = computed((): DetailHighlight[] => {
    const current = this.exercise();
    if (!current) {
      return [];
    }
    const items: DetailHighlight[] = [];
    if (current.primary_equipment) {
      items.push({ labelKey: 'CLASS_DETAILS.EQUIPMENT', value: current.primary_equipment });
    }
    if (current.mechanics) {
      items.push({ labelKey: 'CLASS_DETAILS.MECHANICS', value: current.mechanics });
    }
    if (current.force_type) {
      items.push({ labelKey: 'CLASS_DETAILS.FORCE_TYPE', value: current.force_type });
    }
    if (items.length < 3 && current.posture) {
      items.push({ labelKey: 'CLASS_DETAILS.POSTURE', value: current.posture });
    }
    if (items.length < 3 && current.body_region) {
      items.push({ labelKey: 'CLASS_DETAILS.BODY_REGION', value: current.body_region });
    }
    return items.slice(0, 3);
  });

  readonly heroImage = computed(() => {
    const current = this.exercise();
    if (!current) {
      return null;
    }
    return this.imageFor(current);
  });

  ngOnInit(): void {
    if (this.detailStarted) {
      return;
    }
    this.detailStarted = true;

    const exerciseId = this.route.snapshot.paramMap.get('exerciseId');
    const state = history.state as ExerciseState;

    forkJoin({
      groups: this.classesService.getMuscleGroups().pipe(
        timeout(REQUEST_TIMEOUT_MS),
        catchError(() => of({ message: 'error', musclesGroup: [] as MuscleGroup[] })),
      ),
      levels: this.classesService.getLevels().pipe(
        timeout(REQUEST_TIMEOUT_MS),
        catchError(() => of({ message: 'error', levels: [] as Level[] })),
      ),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ groups, levels }) => {
        this.muscleGroups.set(groups.musclesGroup);
        this.levels.set(levels.levels);
        this.bootstrapExercise(exerciseId, state?.exercise);
      });

    this.loadCategories();
    this.loadPrimeMoverImages();
  }

  private loadPrimeMoverImages(): void {
    this.classesService
      .getPrimeMoverImageMap()
      .pipe(
        timeout(REQUEST_TIMEOUT_MS),
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((map) => this.primeMoverImages.set(map));
  }

  selectGroup(groupId: string): void {
    this.selectedGroupId.set(groupId);
    this.loadPrimeMovers(groupId);
    this.loadSidebarExercises();
  }

  selectDifficulty(level: DifficultyTab): void {
    this.selectedDifficulty.set(level);
    this.loadSidebarExercises();
  }

  selectExercise(item: Exercise): void {
    this.exercise.set(item);
  }

  imageFor(item: Exercise): string | null {
    return exerciseImageUrl(item, this.primeMoverImages());
  }

  sidebarSubtitle(item: Exercise): string {
    const parts = [item.difficulty_level, item.primary_equipment ?? item.prime_mover_muscle]
      .map((part) => part?.trim())
      .filter((part): part is string => Boolean(part));
    return parts.join(' · ');
  }

  playExercise(item: Exercise, event?: Event): void {
    event?.stopPropagation();
    const url = exerciseVideoUrl(item);
    if (!url) {
      return;
    }
    this.play(url, item.exercise);
  }

  play(url: string, title: string): void {
    this.playing.set({ url, title });
  }

  closeVideo(): void {
    this.playing.set(null);
  }

  private bootstrapExercise(exerciseId: string | null, stateExercise?: Exercise): void {
    if (stateExercise) {
      this.applySelectedExercise(stateExercise);
      this.loadPrimeMovers(this.selectedGroupId());
      this.loadSidebarExercises(stateExercise._id);
      this.isLoading.set(false);
      return;
    }

    if (!exerciseId) {
      this.notFound.set(true);
      this.isLoading.set(false);
      return;
    }

    this.classesService
      .findExerciseById(exerciseId)
      .pipe(
        timeout(REQUEST_TIMEOUT_MS),
        catchError(() => of(null)),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((match) => {
        if (!match) {
          this.notFound.set(true);
          return;
        }
        this.applySelectedExercise(match);
        this.loadPrimeMovers(this.selectedGroupId());
        this.loadSidebarExercises(match._id);
      });
  }

  private applySelectedExercise(target: Exercise): void {
    this.exercise.set(target);
    this.syncLevelsForCurrentExercise();
    const targetGroup = (target.target_muscle_group ?? '').trim().toLowerCase();
    const matchedGroup = this.muscleGroups().find((group) => {
      const name = group.name.trim().toLowerCase();
      return name === targetGroup || name.replace(/s$/, '') === targetGroup.replace(/s$/, '');
    });
    if (matchedGroup) {
      this.selectedGroupId.set(matchedGroup._id);
    }
    const difficulty = (target.difficulty_level ?? '').trim() as DifficultyTab;
    if (DIFFICULTY_ORDER.includes(difficulty)) {
      this.selectedDifficulty.set(difficulty);
    }
  }

  private loadPrimeMovers(groupId: string): void {
    if (groupId === 'all') {
      this.primeMovers.set([]);
      return;
    }
    this.classesService
      .getMusclesByGroupId(groupId)
      .pipe(
        timeout(REQUEST_TIMEOUT_MS),
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        this.primeMovers.set(response.muscles);
        this.syncLevelsForCurrentExercise();
      });
  }

  private loadSidebarExercises(preferredId?: string): void {
    const groupId = this.selectedGroupId();
    const levelId = this.levelIdFor(this.selectedDifficulty());

    const source$ =
      groupId !== 'all' && levelId
        ? this.classesService.getRandomExercises(groupId, levelId, SIDEBAR_LIMIT)
        : this.classesService.getExercises(1, SIDEBAR_LIMIT);

    source$
      .pipe(
        timeout(REQUEST_TIMEOUT_MS),
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        const list = response.exercises;
        this.sidebarExercises.set(list);
        const current = this.exercise();
        const keepCurrent = current && list.some((item) => item._id === current._id);
        if (keepCurrent) {
          return;
        }
        const preferred = preferredId ? list.find((item) => item._id === preferredId) : undefined;
        const next = preferred ?? list[0] ?? current;
        if (next) {
          this.exercise.set(next);
        }
      });
  }

  private levelIdFor(tab: DifficultyTab): string | null {
    const scoped = this.levelsForPrimeMover().find((item) => item.name.trim() === tab);
    if (scoped) {
      return scoped.id;
    }
    const level = this.levels().find((item) => item.name.trim() === tab);
    return level?._id ?? null;
  }

  private syncLevelsForCurrentExercise(): void {
    const current = this.exercise();
    if (!current) {
      this.levelsForPrimeMover.set([]);
      return;
    }
    const primeMoverName = (current.prime_mover_muscle ?? '').trim().toLowerCase();
    const primeMover = this.primeMovers().find(
      (muscle) => muscle.name.trim().toLowerCase() === primeMoverName,
    );
    if (!primeMover) {
      this.levelsForPrimeMover.set([]);
      return;
    }
    this.classesService
      .getLevelsByPrimeMover(primeMover._id)
      .pipe(
        timeout(REQUEST_TIMEOUT_MS),
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => this.levelsForPrimeMover.set(response.difficulty_levels));
  }

  private loadCategories(): void {
    this.mealsService
      .getCategories()
      .pipe(
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((categories) => this.categories.set(categories));
  }
}
