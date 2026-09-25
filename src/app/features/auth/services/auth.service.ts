import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, defer, finalize, Observable, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { AuthSessionService } from '../../../core/services/auth-session.service';
import {
  ApiMessageResponse,
  AuthResponse,
  AuthState,
  ChangePasswordRequest,
  EditProfileRequest,
  ForgotPasswordRequest,
  ProfileResponse,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  VerifyResetCodeRequest,
  VerifyResetCodeResponse,
} from '../models/auth.models';

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(AuthSessionService);
  private readonly authState = signal<AuthState>(initialState);

  readonly state = this.authState.asReadonly();
  readonly user = computed(() => this.authState().user);
  readonly isLoading = computed(() => this.authState().isLoading);
  readonly error = computed(() => this.authState().error);
  readonly token = this.session.token;
  readonly isAuthenticated = this.session.isAuthenticated;

  signIn(credentials: SignInRequest): Observable<AuthResponse> {
    return this.runAuthRequest(
      this.http.post<AuthResponse>(API_ENDPOINTS.auth.signin, credentials),
    );
  }

  signUp(data: SignUpRequest): Observable<AuthResponse> {
    return this.runAuthRequest(this.http.post<AuthResponse>(API_ENDPOINTS.auth.signup, data));
  }

  changePassword(data: ChangePasswordRequest): Observable<AuthResponse> {
    return this.runAuthRequest(
      this.http.patch<AuthResponse>(API_ENDPOINTS.auth.changePassword, data),
    );
  }

  uploadPhoto(photo: File): Observable<ProfileResponse> {
    const formData = new FormData();
    formData.append('photo', photo);

    return this.runProfileRequest(
      this.http.put<ProfileResponse>(API_ENDPOINTS.auth.uploadPhoto, formData),
    );
  }

  profileData(): Observable<ProfileResponse> {
    return this.runProfileRequest(this.http.get<ProfileResponse>(API_ENDPOINTS.auth.profileData));
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<ApiMessageResponse> {
    return this.runRequest(
      this.http.post<ApiMessageResponse>(API_ENDPOINTS.auth.forgotPassword, data),
    );
  }

  verifyResetCode(data: VerifyResetCodeRequest): Observable<VerifyResetCodeResponse> {
    return this.runRequest(
      this.http.post<VerifyResetCodeResponse>(API_ENDPOINTS.auth.verifyResetCode, data),
    );
  }

  resetPassword(data: ResetPasswordRequest): Observable<AuthResponse> {
    return this.runAuthRequest(this.http.put<AuthResponse>(API_ENDPOINTS.auth.resetPassword, data));
  }

  deleteAccount(): Observable<ApiMessageResponse> {
    return this.runRequest(
      this.http.delete<ApiMessageResponse>(API_ENDPOINTS.auth.deleteAccount),
      () => this.clearSession(),
    );
  }

  editProfile(data: EditProfileRequest): Observable<ProfileResponse> {
    return this.runProfileRequest(
      this.http.put<ProfileResponse>(API_ENDPOINTS.auth.editProfile, data),
    );
  }

  signOut(): Observable<ApiMessageResponse> {
    return this.runRequest(this.http.get<ApiMessageResponse>(API_ENDPOINTS.auth.logout)).pipe(
      finalize(() => {
        this.session.clearToken();
        this.patchState({ user: null });
      }),
    );
  }

  clearError(): void {
    this.patchState({ error: null });
  }

  clearSession(): void {
    this.session.clearToken();
    this.authState.set(initialState);
  }

  private runAuthRequest(request: Observable<AuthResponse>): Observable<AuthResponse> {
    return this.runRequest(request, (response) => {
      this.session.setToken(response.token);

      if (response.user) {
        this.patchState({ user: response.user });
      }
    });
  }

  private runProfileRequest(request: Observable<ProfileResponse>): Observable<ProfileResponse> {
    return this.runRequest(request, (response) => this.patchState({ user: response.user }));
  }

  private runRequest<T>(request: Observable<T>, onSuccess?: (response: T) => void): Observable<T> {
    return defer(() => {
      this.patchState({ isLoading: true, error: null });

      return request.pipe(
        tap((response) => onSuccess?.(response)),
        catchError((error: unknown) => {
          this.patchState({ error: this.getErrorMessage(error) });
          return throwError(() => error);
        }),
        finalize(() => this.patchState({ isLoading: false })),
      );
    });
  }

  private patchState(patch: Partial<AuthState>): void {
    this.authState.update((state) => ({ ...state, ...patch }));
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiError = error.error as { message?: unknown } | null;

      if (typeof apiError?.message === 'string') {
        return apiError.message;
      }

      return error.message;
    }

    return 'An unexpected error occurred';
  }
}
