import { Routes } from '@angular/router';
import { authChildGuard, authGuard, guestGuard } from './core/guards/auth.guard';

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
    path: 'account',
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    loadComponent: () =>
      import('./core/layout/site-layout/site-layout.component').then((m) => m.SiteLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/account/account-settings/account-settings.component').then(
            (m) => m.AccountSettingsComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/account/account-profile/account-profile.component').then(
            (m) => m.AccountProfileComponent,
          ),
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./features/account/change-password/change-password.component').then(
            (m) => m.ChangePasswordComponent,
          ),
      },
      {
        path: 'security',
        data: {
          titleKey: 'ACCOUNT.INFO.SECURITY_TITLE',
          descriptionKey: 'ACCOUNT.INFO.SECURITY_DESCRIPTION',
          bulletKeys: [
            'ACCOUNT.INFO.SECURITY_BULLET_1',
            'ACCOUNT.INFO.SECURITY_BULLET_2',
            'ACCOUNT.INFO.SECURITY_BULLET_3',
          ],
        },
        loadComponent: () =>
          import('./features/account/account-info/account-info.component').then(
            (m) => m.AccountInfoComponent,
          ),
      },
      {
        path: 'privacy',
        data: {
          titleKey: 'ACCOUNT.INFO.PRIVACY_TITLE',
          descriptionKey: 'ACCOUNT.INFO.PRIVACY_DESCRIPTION',
          bulletKeys: [
            'ACCOUNT.INFO.PRIVACY_BULLET_1',
            'ACCOUNT.INFO.PRIVACY_BULLET_2',
            'ACCOUNT.INFO.PRIVACY_BULLET_3',
          ],
        },
        loadComponent: () =>
          import('./features/account/account-info/account-info.component').then(
            (m) => m.AccountInfoComponent,
          ),
      },
      {
        path: 'help',
        data: {
          titleKey: 'ACCOUNT.INFO.HELP_TITLE',
          descriptionKey: 'ACCOUNT.INFO.HELP_DESCRIPTION',
          bulletKeys: [
            'ACCOUNT.INFO.HELP_BULLET_1',
            'ACCOUNT.INFO.HELP_BULLET_2',
            'ACCOUNT.INFO.HELP_BULLET_3',
          ],
        },
        loadComponent: () =>
          import('./features/account/account-info/account-info.component').then(
            (m) => m.AccountInfoComponent,
          ),
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
