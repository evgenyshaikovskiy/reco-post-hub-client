import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { setSpinnerState } from '../../store/actions';
import { AuthService } from '../../core/services/auth.service';
import { finalize } from 'rxjs';

export const rootPageResolver: ResolveFn<boolean> = () => {
  const store = inject(Store);
  const authService = inject(AuthService);

  store.dispatch(setSpinnerState({ state: true }));

  return authService
    .configure()
    .pipe(finalize(() => store.dispatch(setSpinnerState({ state: false }))));
};
