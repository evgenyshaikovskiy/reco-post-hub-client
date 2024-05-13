import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { IUserProfile } from '../../core/interfaces/user.interface';
import { ProfileService } from '../../core/services/profile.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { inject } from '@angular/core';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';
import { catchError, finalize, of } from 'rxjs';

export const profilePageResolver: ResolveFn<IUserProfile | null> = (
  route: ActivatedRouteSnapshot
) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);
  const spinnerService = inject(SpinnerService);
  const notificationService = inject(ToastNotificationsService);

  spinnerService.changeLoadingState(true);
  console.log(route.paramMap.get('username'));

  return profileService.getUserProfile(route.paramMap.get('username')!).pipe(
    catchError(error => {
      console.log(error);
      notificationService.showNotification('error', 'Profile not found!');
      router.navigate(['']);
      return of(null);
    }),
    finalize(() => spinnerService.changeLoadingState(false))
  );
};
