import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import {
  loadEnglishTranslations,
  provideEnglishTranslations,
} from '../../../../../testing/english-translations';
import { WorkoutsService } from '../../../auth/services/workouts-service';
import { ClassesService } from '../../../classes/services/classes.service';
import { WorkoutsSectionComponent } from './workouts-section.component';

describe('WorkoutsSectionComponent', () => {
  let component: WorkoutsSectionComponent;
  let fixture: ComponentFixture<WorkoutsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutsSectionComponent],
      providers: [
        provideRouter([]),
        ...provideEnglishTranslations(),
        {
          provide: WorkoutsService,
          useValue: {
            getMuscleGroups: () => of({ message: 'success', musclesGroup: [] }),
            getExercisesByMuscle: () => of({ message: 'success', exercises: [] }),
          },
        },
        {
          provide: ClassesService,
          useValue: {
            getPrimeMoverImageMap: () => of(new Map<string, string>()),
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
