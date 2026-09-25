import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { AuthSessionService } from '../../../core/services/auth-session.service';
import { AuthResponse, AuthUser, SignInRequest, SignUpRequest } from '../models/auth.models';
import { AuthService } from './auth.service';

class AuthSessionStub {
  private readonly tokenState = signal<string | null>(null);

  readonly token = this.tokenState.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.tokenState()));

  setToken(token: string): void {
    this.tokenState.set(token);
  }

  clearToken(): void {
    this.tokenState.set(null);
  }
}

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;
  let session: AuthSessionStub;

  const user: AuthUser = {
    _id: 'user-id',
    firstName: 'Elevate',
    lastName: 'Tech',
    email: 'user@example.com',
    gender: 'male',
    height: 170,
    weight: 70,
    age: 30,
    goal: 'Gain weight',
    activityLevel: 'level1',
  };

  beforeEach(() => {
    session = new AuthSessionStub();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthSessionService, useValue: session },
      ],
    });

    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('signs in and updates the authentication state', () => {
    const credentials: SignInRequest = {
      email: 'user@example.com',
      password: 'Password@123',
    };
    const response: AuthResponse = { message: 'success', token: 'token', user };

    service.signIn(credentials).subscribe();

    expect(service.isLoading()).toBe(true);

    const request = httpController.expectOne(API_ENDPOINTS.auth.signin);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(credentials);
    request.flush(response);

    expect(service.token()).toBe('token');
    expect(service.user()).toEqual(user);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.isLoading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('sends signup data to the documented endpoint', () => {
    const data: SignUpRequest = {
      firstName: 'Elevate',
      lastName: 'Tech',
      email: 'user@example.com',
      password: 'Password@123',
      rePassword: 'Password@123',
      gender: 'male',
      height: 170,
      weight: 70,
      age: 30,
      goal: 'Gain weight',
      activityLevel: 'level1',
    };

    service.signUp(data).subscribe();

    const request = httpController.expectOne(API_ENDPOINTS.auth.signup);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(data);
    request.flush({ message: 'success', token: 'token', user } satisfies AuthResponse);

    expect(service.user()).toEqual(user);
  });

  it('changes the password and stores the refreshed token', () => {
    const data = { password: 'Password@123', newPassword: 'NewPassword@123' };

    service.changePassword(data).subscribe();

    const request = httpController.expectOne(API_ENDPOINTS.auth.changePassword);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual(data);
    request.flush({ message: 'success', token: 'refreshed-token' } satisfies AuthResponse);

    expect(service.token()).toBe('refreshed-token');
  });

  it('uploads the profile photo as form data and updates the user', () => {
    const photo = new File(['photo'], 'profile.png', { type: 'image/png' });

    service.uploadPhoto(photo).subscribe();

    const request = httpController.expectOne(API_ENDPOINTS.auth.uploadPhoto);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toBeInstanceOf(FormData);
    expect((request.request.body as FormData).get('photo')).toBe(photo);
    request.flush({ message: 'success', user: { ...user, photo: 'profile.png' } });

    expect(service.user()?.photo).toBe('profile.png');
  });

  it('loads the profile data into state', () => {
    service.profileData().subscribe();

    const request = httpController.expectOne(API_ENDPOINTS.auth.profileData);
    expect(request.request.method).toBe('GET');
    request.flush({ message: 'success', user });

    expect(service.user()).toEqual(user);
  });

  it('supports the complete password reset flow', () => {
    const forgotData = { email: 'user@example.com' };
    service.forgotPassword(forgotData).subscribe();

    const forgotRequest = httpController.expectOne(API_ENDPOINTS.auth.forgotPassword);
    expect(forgotRequest.request.method).toBe('POST');
    expect(forgotRequest.request.body).toEqual(forgotData);
    forgotRequest.flush({ message: 'success', info: 'Reset code sent' });

    const verifyData = { resetCode: '123456' };
    service.verifyResetCode(verifyData).subscribe();

    const verifyRequest = httpController.expectOne(API_ENDPOINTS.auth.verifyResetCode);
    expect(verifyRequest.request.method).toBe('POST');
    expect(verifyRequest.request.body).toEqual(verifyData);
    verifyRequest.flush({ status: 'Success' });

    const resetData = { email: 'user@example.com', newPassword: 'NewPassword@123' };
    service.resetPassword(resetData).subscribe();

    const resetRequest = httpController.expectOne(API_ENDPOINTS.auth.resetPassword);
    expect(resetRequest.request.method).toBe('PUT');
    expect(resetRequest.request.body).toEqual(resetData);
    resetRequest.flush({ message: 'success', token: 'reset-token' } satisfies AuthResponse);

    expect(service.token()).toBe('reset-token');
  });

  it('edits the profile and updates the user state', () => {
    service.editProfile({ lastName: 'Updated' }).subscribe();

    const request = httpController.expectOne(API_ENDPOINTS.auth.editProfile);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ lastName: 'Updated' });
    request.flush({ message: 'success', user: { ...user, lastName: 'Updated' } });

    expect(service.user()?.lastName).toBe('Updated');
  });

  it('deletes the account and clears the local session', () => {
    session.setToken('token');

    service.deleteAccount().subscribe();

    const request = httpController.expectOne(API_ENDPOINTS.auth.deleteAccount);
    expect(request.request.method).toBe('DELETE');
    request.flush({ message: 'success' });

    expect(service.token()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('exposes the API error message in state', () => {
    service.signIn({ email: 'wrong@example.com', password: 'wrong' }).subscribe({
      error: () => undefined,
    });

    const request = httpController.expectOne(API_ENDPOINTS.auth.signin);
    request.flush(
      { message: 'Invalid email or password' },
      { status: 401, statusText: 'Unauthorized' },
    );

    expect(service.error()).toBe('Invalid email or password');
    expect(service.isLoading()).toBe(false);
  });
});
