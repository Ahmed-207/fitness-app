import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiErrorService } from '../http/api-error.service';
import { apiErrorInterceptor, REQUEST_FAILED_MESSAGE_KEY } from './api-error.interceptor';

describe('apiErrorInterceptor', () => {
  let http: HttpClient;
  let httpController: HttpTestingController;
  let apiError: ApiErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
    apiError = TestBed.inject(ApiErrorService);
  });

  afterEach(() => httpController.verify());

  it('stores the API error string', () => {
    http.post('/auth/signup', {}).subscribe({ error: () => undefined });

    httpController
      .expectOne('/auth/signup')
      .flush({ error: 'Email already exists' }, { status: 401, statusText: 'Unauthorized' });

    expect(apiError.message()).toBe('Email already exists');
  });

  it('stores a translation key fallback when the body has no message', () => {
    http.get('/auth/profile-data').subscribe({ error: () => undefined });

    httpController
      .expectOne('/auth/profile-data')
      .flush({}, { status: 500, statusText: 'Server Error' });

    expect(apiError.message()).toBe(REQUEST_FAILED_MESSAGE_KEY);
  });

  it('clears the previous message when the next request starts', () => {
    apiError.set('Email already exists');

    http.get('/auth/profile-data').subscribe();

    expect(apiError.message()).toBeNull();
    httpController.expectOne('/auth/profile-data').flush({ message: 'success' });
  });
});
