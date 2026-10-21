import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import {
  loadEnglishTranslations,
  provideEnglishTranslations,
} from '../../../../testing/english-translations';
import { MealsService } from '../services/meals.service';
import { HealthyPageComponent } from './healthy-page.component';

const MEALS = [{ idMeal: 'm1', strMeal: 'Beef Stew', strMealThumb: 'stew.png' }];

describe('HealthyPageComponent', () => {
  let fixture: ComponentFixture<HealthyPageComponent>;
  let component: HealthyPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthyPageComponent],
      providers: [
        provideRouter([]),
        ...provideEnglishTranslations(),
        {
          provide: MealsService,
          useValue: {
            getMealsByCategory: () => of(MEALS),
          },
        },
      ],
    }).compileComponents();

    loadEnglishTranslations();
    fixture = TestBed.createComponent(HealthyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selects dinner by default and loads its meals', () => {
    expect(component.selectedTabId()).toBe('dinner');
    expect(component.selectedCategory()).toBe('Beef');
    expect(component.meals().length).toBe(1);
  });
});
