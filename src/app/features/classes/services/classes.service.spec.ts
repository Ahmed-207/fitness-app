import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { ClassesService } from './classes.service';

describe('ClassesService', () => {
  let service: ClassesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClassesService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ClassesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads muscle groups from GET /muscles', () => {
    service.getMuscleGroups().subscribe((response) => {
      expect(response.musclesGroup[0].name).toBe('Abdominals');
    });

    const req = http.expectOne(`${environment.apiBaseUrl}/muscles`);
    expect(req.request.method).toBe('GET');
    req.flush({
      message: 'success',
      musclesGroup: [{ _id: 'g1', name: 'Abdominals ' }],
    });
  });

  it('loads exercises by prime mover and difficulty', () => {
    service.getExercisesByMuscleAndDifficulty('pm1', 'l1', 2, 12).subscribe();

    const req = http.expectOne(
      (r) =>
        r.url === `${environment.apiBaseUrl}/exercises/by-muscle-difficulty` &&
        r.params.get('primeMoverMuscleId') === 'pm1' &&
        r.params.get('difficultyLevelId') === 'l1' &&
        r.params.get('page') === '2' &&
        r.params.get('limit') === '12',
    );
    expect(req.request.method).toBe('GET');
    req.flush({
      message: 'success',
      totalExercises: 0,
      totalPages: 1,
      currentPage: 2,
      exercises: [],
    });
  });

  it('loads difficulty levels for a prime mover muscle', () => {
    service.getLevelsByPrimeMover('pm1').subscribe((response) => {
      expect(response.difficulty_levels[0].id).toBe('l1');
    });

    const req = http.expectOne(
      (r) =>
        r.url === `${environment.apiBaseUrl}/levels/difficulty-levels/by-prime-mover` &&
        r.params.get('primeMoverMuscleId') === 'pm1',
    );
    req.flush({
      message: 'success',
      totalLevels: 1,
      difficulty_levels: [{ id: 'l1', name: 'Beginner' }],
    });
  });
});
