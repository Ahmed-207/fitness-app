
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/layout/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'register', pathMatch: 'full' },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'forget-password',
        loadComponent: () =>
          import('./features/auth/forget-password/forget-password').then(
            (m) => m.ForgotPasswordComponent
          ),
      },
      {
        path: 'verify-otp',
  loadComponent: () => import('./features/auth/verify-otp/verify-otp').then(
    m => m.VerifyOtpComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/reset-password/reset-password').then(
            (m) => m.ResetPasswordComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'auth/register' },
];
