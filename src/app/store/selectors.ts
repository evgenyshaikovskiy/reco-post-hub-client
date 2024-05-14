import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ISharedState } from './app.interface';

export const APP_SHARED_NAME = 'shared';

const appState = createFeatureSelector<ISharedState>(APP_SHARED_NAME);

export const getSpinnerState = createSelector(
  appState,
  state => state.spinnerState
);

export const getUserInfo = createSelector(
  appState,
  state => state.currentUserData
);
