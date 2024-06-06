import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  setSpinnerState,
  setUserData,
  signIn,
  signInFailed,
  signInSuccess,
  updateUserData,
} from './actions';
import { AuthService } from '../core/services/auth.service';
import { Store } from '@ngrx/store';
import { finalize, map, switchMap, tap } from 'rxjs';
import { ToastNotificationsService } from '../core/services/toast-notifications.service';
import { Router } from '@angular/router';
import { NotificationService } from '../core/services/notification.service';

@Injectable()
export class ApplicationEffects {
  userSignIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signIn),
      tap(() => this.store.dispatch(setSpinnerState({ state: true }))),
      switchMap(action =>
        this.authService.signIn(action.data).pipe(
          map(data => {
            if (data) {
              this.store.dispatch(setUserData({ data: data.user }));
              this.authService.setSession(data);
              this.notificationService.showNotification(
                'success',
                'You were logged in successfully'
              );
              this.router.navigate(['']);
              this.userNotificationService.configure();
              return signInSuccess();
            } else {
              this.notificationService.showNotification(
                'error',
                'Wrong credentials'
              );
              return signInFailed();
            }
          }),
          finalize(() => this.store.dispatch(setSpinnerState({ state: false })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserData),
      switchMap(() =>
        this.authService.fetchUser().pipe(
          map(user => {
            return setUserData({ data: user });
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private authService: AuthService,
    private notificationService: ToastNotificationsService,
    private userNotificationService: NotificationService,
    private router: Router
  ) {}
}
