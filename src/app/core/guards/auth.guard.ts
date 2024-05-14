import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { setUserData } from '../../store/actions';

export const authGuard: CanActivateFn = ():
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const store = inject(Store);
  console.log('auth guard');

  if (!authService.isLoggedIn()) {
    authService.logOut();
    router.navigate(['sign-in']);

    return false;
  }

  console.log(authService.User, authService.User === null);
  if (!authService.User) {
    return authService.fetchUser().pipe(
      map(user => {
        store.dispatch(setUserData({ data: user }));
        return true;
      })
    );
  }

  return true;
};
