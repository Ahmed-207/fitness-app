import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import {
  loadEnglishTranslations,
  provideEnglishTranslations,
} from '../../../../../testing/english-translations';
import { WorkoutsService } from '../../../auth/services/workouts-service';
import { WorkoutsSectionComponent } from './workouts-section.component';

describe('WorkoutsSectionComponent', () => {
  let component: WorkoutsSectionComponent;
  let fixture: ComponentFixture<WorkoutsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutsSectionComponent],
      providers: [
        ...provideEnglishTranslations(),
        {
          provide: WorkoutsService,
          useValue: {
            getMuscleGroups: () => of({ message: 'success', musclesGroup: [] }),
            getExercisesByMuscle: () => of({ message: 'success', exercises: [] }),
          },
        },
      ],
    }).compileComponents();

    loadEnglishTranslations();
    fixture = TestBed.createComponent(WorkoutsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
