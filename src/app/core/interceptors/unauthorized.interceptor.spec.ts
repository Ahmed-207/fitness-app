import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { AuthSessionService } from '../services/auth-session.service';
import { unauthorizedInterceptor } from './unauthorized.interceptor';

describe('unauthorizedInterceptor', () => {
  let http: HttpClient;
  let httpController: HttpTestingController;
  let clearSession: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    clearSession = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([unauthorizedInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: AuthSessionService,
          useValue: {
            token: signal('token'),
            clearSession,
          },
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });

  afterEach(() => httpController.verify());

  it('leaves the user on signup when validation returns 401', () => {
    http.post(API_ENDPOINTS.auth.signup, {}).subscribe({ error: () => undefined });

    httpController
      .expectOne(API_ENDPOINTS.auth.signup)
      .flush({ error: 'password is too weak' }, { status: 401, statusText: 'Unauthorized' });

    expect(clearSession).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('sends an expired protected session back to login', () => {
    http.get(API_ENDPOINTS.auth.profileData).subscribe({ error: () => undefined });

    httpController
      .expectOne(API_ENDPOINTS.auth.profileData)
      .flush(
        { error: 'invalid token .. login again' },
        { status: 401, statusText: 'Unauthorized' },
      );

    expect(clearSession).toHaveBeenCalledOnce();
    expect(navigate).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { returnUrl: '/' },
    });
  });
});
