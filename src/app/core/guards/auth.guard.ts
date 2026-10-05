import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthSessionService } from '../services/auth-session.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const session = inject(AuthSessionService);

  if (session.isAuthenticated()) {
    return true;
  }

  return inject(Router).createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });
};

export const authChildGuard: CanActivateChildFn = authGuard;

/** Auth screens (login/register) — send signed-in users to the app home. */
export const guestGuard: CanActivateFn = () => {
  const session = inject(AuthSessionService);

  if (!session.isAuthenticated()) {
    return true;
  }

  return inject(Router).createUrlTree(['/home']);
};
