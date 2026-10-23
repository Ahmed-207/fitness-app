import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { MealsService } from './meals.service';

describe('MealsService', () => {
  let service: MealsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MealsService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MealsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads meals by category from TheMealDB filter endpoint', () => {
    service.getMealsByCategory('Beef').subscribe((meals) => {
      expect(meals.length).toBe(1);
      expect(meals[0].strMeal).toBe('Beef Stew');
    });

    const req = http.expectOne(
      (r) => r.url === `${environment.mealsApiBaseUrl}/filter.php` && r.params.get('c') === 'Beef',
    );
    expect(req.request.method).toBe('GET');
    req.flush({ meals: [{ idMeal: '1', strMeal: 'Beef Stew', strMealThumb: 'x.png' }] });
  });

  it('loads meal details from TheMealDB lookup endpoint', () => {
    service.getMealDetails('42').subscribe((meal) => {
      expect(meal?.strMeal).toBe('Test Meal');
    });

    const req = http.expectOne(
      (r) => r.url === `${environment.mealsApiBaseUrl}/lookup.php` && r.params.get('i') === '42',
    );
    req.flush({
      meals: [
        {
          idMeal: '42',
          strMeal: 'Test Meal',
          strMealThumb: 't.png',
          strCategory: 'Beef',
          strInstructions: 'Cook',
        },
      ],
    });
  });
});
