import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
} from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export const profilePageGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
) => {
  const requestedUsername = route.paramMap.get('username');
  const router = inject(Router);
  if (!requestedUsername) return false;

  const authService = inject(AuthService);
  if (!authService.isLoggedIn()) return true;

  if (authService.User?.username === requestedUsername) {
    router.navigate(['settings']);
    return false;
  }

  
  return true;
};
