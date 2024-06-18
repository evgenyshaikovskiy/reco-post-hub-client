import { createReducer, on } from '@ngrx/store';
import { initialState } from './app.interface';
import { setSpinnerState, setUserData, signInFailed, signInSuccess } from './actions';

export const appReducer = createReducer(
  initialState,
  on(setSpinnerState, (state, action) => ({
    ...state,
    spinnerState: action.state,
  })),
  on(setUserData, (state, action) => ({
    ...state,
    currentUserData: action.data,
  })),
  on(signInSuccess, (state) => ({
    ...state,
    signInFailed: false,
  })),
  on(signInFailed, (state) => ({
    ...state,
    signInFailed: true,
  }))
);
