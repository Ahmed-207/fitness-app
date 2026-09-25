export type Gender = 'male' | 'female';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rePassword: string;
  gender: Gender;
  height: number;
  weight: number;
  age: number;
  goal: string;
  activityLevel: string;
}

export interface ChangePasswordRequest {
  password: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  resetCode: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export type EditProfileRequest = Partial<
  Pick<
    SignUpRequest,
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'gender'
    | 'height'
    | 'weight'
    | 'age'
    | 'goal'
    | 'activityLevel'
  >
>;

export interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  height: number;
  weight: number;
  age: number;
  goal: string;
  activityLevel: string;
  photo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user?: AuthUser;
}

export interface ApiMessageResponse {
  message: string;
  info?: string;
}

export interface ProfileResponse extends ApiMessageResponse {
  user: AuthUser;
}

export interface VerifyResetCodeResponse {
  status: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}
