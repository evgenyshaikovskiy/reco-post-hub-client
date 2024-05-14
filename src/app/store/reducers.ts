import { createReducer, on } from '@ngrx/store';
import { initialState } from './app.interface';
import { setSpinnerState, setUserData } from './actions';

export const appReducer = createReducer(
  initialState,
  on(setSpinnerState, (state, action) => ({
    ...state,
    spinnerState: action.state,
  })),
  on(setUserData, (state, action) => ({
    ...state,
    currentUserData: action.data,
  }))
);
