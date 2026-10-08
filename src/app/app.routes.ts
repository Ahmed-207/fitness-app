import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/site-layout/site-layout.component').then((m) => m.SiteLayoutComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'about-us',
        loadComponent: () =>
          import('./features/about-us/aboutus-page/aboutus-page').then((m) => m.AboutusPage),
      },

      
    ],
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    canActivateChild: [guestGuard],
    loadComponent: () =>
      import('./core/layout/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'forget-password',
        loadComponent: () =>
          import('./features/auth/forget-password/forget-password').then(
            (m) => m.ForgotPasswordComponent,
          ),
      },
      {
        path: 'verify-otp',
        loadComponent: () =>
          import('./features/auth/verify-otp/verify-otp').then((m) => m.VerifyOtpComponent),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/reset-password/reset-password').then(
            (m) => m.ResetPasswordComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
