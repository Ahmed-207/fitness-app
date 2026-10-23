import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import {
  loadEnglishTranslations,
  provideEnglishTranslations,
} from '../../../../testing/english-translations';
import { MealsService } from '../../healthy/services/meals.service';
import { Exercise } from '../models/classes.models';
import { ClassesService } from '../services/classes.service';
import { ClassDetailsPageComponent } from './class-details-page.component';

const CATEGORIES = [
  { idCategory: '1', strCategory: 'Beef', strCategoryThumb: 'beef.png', strCategoryDescription: '' },
];

const MUSCLE_GROUPS = {
  message: 'success',
  musclesGroup: [
    { _id: 'g-chest', name: 'Chest' },
    { _id: 'g-back', name: 'Back' },
  ],
};

const LEVELS = {
  message: 'success',
  levels: [
    { _id: 'l-beginner', name: 'Beginner' },
    { _id: 'l-intermediate', name: 'Intermediate' },
    { _id: 'l-advanced', name: 'Advanced' },
  ],
};

const MOCK_EXERCISE: Exercise = {
  _id: 'e1',
  exercise: 'Bench Press',
  short_youtube_demonstration: null,
  in_depth_youtube_explanation: null,
  difficulty_level: 'Beginner',
  target_muscle_group: 'Chest',
  prime_mover_muscle: 'Pectoralis Major',
  secondary_muscle: null,
  tertiary_muscle: null,
  primary_equipment: 'Barbell',
  _primary_items: 1,
  secondary_equipment: null,
  _secondary_items: 0,
  posture: null,
  single_or_double_arm: null,
  continuous_or_alternating_arms: null,
  grip: null,
  load_position_ending: null,
  continuous_or_alternating_legs: null,
  foot_elevation: null,
  combination_exercises: null,
  movement_pattern_1: null,
  movement_pattern_2: null,
  movement_pattern_3: null,
  plane_of_motion_1: null,
  plane_of_motion_2: null,
  plane_of_motion_3: null,
  body_region: null,
  force_type: null,
  mechanics: null,
  laterality: null,
  primary_exercise_classification: null,
  short_youtube_demonstration_link: 'https://www.youtube.com/watch?v=abc123',
  in_depth_youtube_explanation_link: null,
};

describe('ClassDetailsPageComponent', () => {
  let fixture: ComponentFixture<ClassDetailsPageComponent>;
  let component: ClassDetailsPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassDetailsPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'exerciseId' ? 'e1' : null),
              },
            },
          },
        },
        ...provideEnglishTranslations(),
        {
          provide: ClassesService,
          useValue: {
            getMuscleGroups: () => of(MUSCLE_GROUPS),
            getLevels: () => of(LEVELS),
            getPrimeMoverImageMap: () => of(new Map<string, string>()),
            getLevelsByPrimeMover: () =>
              of({
                message: 'success',
                totalLevels: 1,
                difficulty_levels: [{ id: 'l-beginner', name: 'Beginner' }],
              }),
            getMusclesByGroupId: () =>
              of({
                message: 'success',
                muscleGroup: MUSCLE_GROUPS.musclesGroup[0],
                muscles: [],
              }),
            getRandomExercises: () =>
              of({
                message: 'success',
                totalExercises: 2,
                exercises: [MOCK_EXERCISE, { ...MOCK_EXERCISE, _id: 'e2', exercise: 'Incline Press' }],
              }),
            findExerciseById: () => of(MOCK_EXERCISE),
            getExercises: () =>
              of({
                message: 'success',
                totalExercises: 1,
                totalPages: 1,
                currentPage: 1,
                exercises: [MOCK_EXERCISE],
              }),
          },
        },
        {
          provide: MealsService,
          useValue: { getCategories: () => of(CATEGORIES) },
        },
      ],
    }).compileComponents();

    loadEnglishTranslations();
    fixture = TestBed.createComponent(ClassDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads meal categories and sidebar exercises from the API', () => {
    expect(component.categories().length).toBe(1);
    expect(component.sidebarExercises().length).toBe(2);
  });
});
