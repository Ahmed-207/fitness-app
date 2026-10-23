import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import {
  loadEnglishTranslations,
  provideEnglishTranslations,
} from '../../../../testing/english-translations';
import { MealDetail } from '../models/meals.models';
import { MealsService } from '../services/meals.service';
import { MealDetailPageComponent } from './meal-detail-page.component';

const MEALS = [{ idMeal: 'm1', strMeal: 'Beef Stew', strMealThumb: 'stew.png' }];

const MEAL_DETAIL: MealDetail = {
  idMeal: 'm1',
  strMeal: 'Beef Stew',
  strMealThumb: 'stew.png',
  strCategory: 'Beef',
  strArea: 'Irish',
  strCountry: null,
  strInstructions: 'Cook it well.',
  strTags: null,
  strYoutube: null,
  strSource: null,
  strIngredient1: 'Beef',
  strMeasure1: '500g',
  strIngredient2: '',
  strMeasure2: '',
};

describe('MealDetailPageComponent', () => {
  let fixture: ComponentFixture<MealDetailPageComponent>;
  let component: MealDetailPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealDetailPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => (key === 'mealId' ? 'm1' : null),
            }),
            queryParamMap: of({
              get: (key: string) => (key === 'c' ? 'Beef' : null),
            }),
          },
        },
        ...provideEnglishTranslations(),
        {
          provide: MealsService,
          useValue: {
            getCategories: () =>
              of([
                {
                  idCategory: '1',
                  strCategory: 'Beef',
                  strCategoryThumb: 'beef.png',
                  strCategoryDescription: '',
                },
              ]),
            getMealsByCategory: () => of(MEALS),
            getMealDetails: () => of(MEAL_DETAIL),
          },
        },
      ],
    }).compileComponents();

    loadEnglishTranslations();
    fixture = TestBed.createComponent(MealDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads sidebar meals and meal detail from the API', () => {
    expect(component.sidebarMeals().length).toBe(1);
    expect(component.meal()?.strMeal).toBe('Beef Stew');
    expect(component.ingredients().length).toBe(1);
    expect(component.activeMealId()).toBe('m1');
  });
});
