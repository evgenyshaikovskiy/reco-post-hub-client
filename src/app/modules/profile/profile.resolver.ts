import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { IUserProfile } from '../../core/interfaces/user.interface';
import { ProfileService } from '../../core/services/profile.service';
import { inject } from '@angular/core';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { setSpinnerState } from '../../store/actions';
import { AuthService } from '../../core/services/auth.service';

export const profilePageResolver: ResolveFn<IUserProfile | null> = (
  route: ActivatedRouteSnapshot
) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);
  const notificationService = inject(ToastNotificationsService);
  const store = inject(Store);
  const authService = inject(AuthService);
  const requestedUsername = route.paramMap.get('username');

  store.dispatch(setSpinnerState({ state: true }));

  if (authService.isLoggedIn() && !authService.User) {
    // check if author is the same

    return authService.fetchUser().pipe(
      switchMap(user => {
        if (user.username === requestedUsername) {
          router.navigate(['settings']);
          store.dispatch(setSpinnerState({ state: false }));

          return of(user);
        } else {
          return profileService
            .getUserProfile(requestedUsername as string)
            .pipe(
              catchError(() => {
                notificationService.showNotification(
                  'error',
                  'Profile not found!'
                );
                return of(null);
              }),
              finalize(() => store.dispatch(setSpinnerState({ state: false })))
            );
        }
      })
    );
  }

  return profileService.getUserProfile(requestedUsername as string).pipe(
    catchError(() => {
      notificationService.showNotification('error', 'Profile not found!');
      return of(null);
    }),
    finalize(() => store.dispatch(setSpinnerState({ state: false })))
  );
};
