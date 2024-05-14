import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { IUserProfile } from '../../core/interfaces/user.interface';
import { ProfileService } from '../../core/services/profile.service';
import { inject } from '@angular/core';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';
import { catchError, finalize, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { setSpinnerState } from '../../store/actions';

export const profilePageResolver: ResolveFn<IUserProfile | null> = (
  route: ActivatedRouteSnapshot
) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);
  const notificationService = inject(ToastNotificationsService);
  const store = inject(Store);

  store.dispatch(setSpinnerState({ state: true }));
  console.log(route.paramMap.get('username'));

  return profileService.getUserProfile(route.paramMap.get('username')!).pipe(
    catchError(error => {
      console.log(error);
      notificationService.showNotification('error', 'Profile not found!');
      router.navigate(['']);
      return of(null);
    }),
    finalize(() => store.dispatch(setSpinnerState({ state: true })))
  );
};
