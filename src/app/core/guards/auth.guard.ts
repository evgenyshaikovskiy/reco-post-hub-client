import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { finalize, map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { setSpinnerState, setUserData } from '../../store/actions';

export const authGuard: CanActivateFn = ():
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const store = inject(Store);

  if (!authService.isLoggedIn()) {
    authService.logOut();
    router.navigate(['sign-in']);

    return false;
  }

  if (!authService.User) {
    store.dispatch(setSpinnerState({ state: true }));
    return authService.fetchUser().pipe(
      map(user => {
        store.dispatch(setUserData({ data: user }));
        return true;
      }),
      finalize(() => store.dispatch(setSpinnerState({ state: false })))
    );
  }

  return true;
};
