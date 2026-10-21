import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import {
  loadEnglishTranslations,
  provideEnglishTranslations,
} from '../../../../testing/english-translations';
import { ClassesService } from '../services/classes.service';
import { ClassesPageComponent } from './classes-page.component';

const MUSCLE_GROUPS = {
  message: 'success',
  musclesGroup: [
    { _id: 'g1', name: 'Chest' },
    { _id: 'g2', name: 'Back' },
  ],
};

const LEVELS = {
  message: 'success',
  levels: [{ _id: 'l1', name: 'Beginner' }],
};

const EXERCISE_PAGE = {
  message: 'success',
  totalExercises: 2,
  totalPages: 1,
  currentPage: 1,
  exercises: [
    {
      _id: 'e1',
      exercise: 'Bench Press',
      target_muscle_group: 'Chest',
      short_youtube_demonstration_link: 'https://www.youtube.com/watch?v=abc123',
    },
    {
      _id: 'e2',
      exercise: 'Barbell Row',
      target_muscle_group: 'Back',
      short_youtube_demonstration_link: null,
    },
  ],
};

const FILTERED_PAGE = {
  message: 'success',
  totalExercises: 1,
  totalPages: 1,
  currentPage: 1,
  exercises: [EXERCISE_PAGE.exercises[0]],
};

describe('ClassesPageComponent', () => {
  let fixture: ComponentFixture<ClassesPageComponent>;
  let component: ClassesPageComponent;
  let classesService: {
    getMuscleGroups: ReturnType<typeof vi.fn>;
    getLevels: ReturnType<typeof vi.fn>;
    getExercises: ReturnType<typeof vi.fn>;
    getPrimeMoversByMuscleGroup: ReturnType<typeof vi.fn>;
    getExercisesByMuscleAndDifficulty: ReturnType<typeof vi.fn>;
    getPrimeMoverImageMap: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    classesService = {
      getMuscleGroups: vi.fn(() => of(MUSCLE_GROUPS)),
      getLevels: vi.fn(() => of(LEVELS)),
      getExercises: vi.fn(() => of(EXERCISE_PAGE)),
      getPrimeMoversByMuscleGroup: vi.fn(() =>
        of({
          message: 'success',
          totalMuscles: 1,
          muscles: [{ _id: 'pm1', name: 'Pectoralis', image: null }],
        }),
      ),
      getExercisesByMuscleAndDifficulty: vi.fn(() => of(FILTERED_PAGE)),
      getPrimeMoverImageMap: vi.fn(() => of(new Map<string, string>())),
    };

    await TestBed.configureTestingModule({
      imports: [ClassesPageComponent],
      providers: [
        provideRouter([]),
        ...provideEnglishTranslations(),
        { provide: ClassesService, useValue: classesService },
      ],
    }).compileComponents();

    loadEnglishTranslations();
    fixture = TestBed.createComponent(ClassesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lists muscle groups as tabs plus full body', () => {
    expect(component.muscleGroups().length).toBe(2);
  });

  it('loads the first exercise page', () => {
    expect(component.exercises().length).toBe(2);
    expect(component.hasMore()).toBe(false);
  });

  it('loads exercises by muscle group via by-muscle-difficulty', () => {
    component.selectGroup('g1');
    fixture.detectChanges();
    expect(classesService.getPrimeMoversByMuscleGroup).toHaveBeenCalledWith('g1');
    expect(classesService.getExercisesByMuscleAndDifficulty).toHaveBeenCalled();
    expect(component.visibleExercises().map((card) => card.name)).toEqual(['Bench Press']);
  });

  it('opens the video modal for cards with a demo link', () => {
    const card = component.exercises()[0];
    component.play(card);
    expect(component.playing()?.url).toBe('https://www.youtube.com/watch?v=abc123');
    component.closeVideo();
    expect(component.playing()).toBeNull();
  });
});
