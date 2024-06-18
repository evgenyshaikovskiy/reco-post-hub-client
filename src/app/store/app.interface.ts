import { IUser } from '../core/interfaces/user.interface';
import { APP_SHARED_NAME } from './selectors';

export interface IApp {
  [APP_SHARED_NAME]: ISharedState;
}

export interface IAppState {
  [APP_SHARED_NAME]: ISharedState;
}

export interface ISharedState {
  currentUserData?: IUser;
  spinnerState: boolean;
  signInFailed: boolean;
}

export const initialState: ISharedState = {
  currentUserData: undefined,
  spinnerState: false,
  signInFailed: false,
};

export const initialAppState: IApp = {
  [APP_SHARED_NAME]: initialState,
};
