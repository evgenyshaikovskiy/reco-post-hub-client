import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../interfaces/user.interface';
import { ToastNotificationsService } from '../services/toast-notifications.service';

export const adminGuard: CanActivateFn = ():
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(ToastNotificationsService);

  if (authService.isLoggedIn()) {
    return authService.fetchUser().pipe(
      map(currentUser => {
        const isModOrAdmin =
          currentUser.role === UserRole.ADMIN ||
          currentUser.role === UserRole.MOD;
        if (!isModOrAdmin) {
          notificationService.showNotification(
            'warning',
            'You are not authorized to view this page'
          );

          router.navigate(['']);
          return false;
        }

        return isModOrAdmin;
      })
    );
  }

  return false;
};
