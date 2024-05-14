import { createAction, props } from '@ngrx/store';
import { UserSignInDto } from '../core/interfaces/user-sign-in.interface';
import { IUser } from '../core/interfaces/user.interface';

// COMMON
export const SET_SPINNER_STATE = '[Global] set spinner state';
export const UPDATE_USER_DATA = '[Global] update user data';
export const SET_USER_DATA = '[Global] set user data';

// SIGN IN ACTIONS NAMES
export const USER_SIGN_IN = '[Sign In Module] sign in action';
export const USER_SIGN_IN_SUCCESS = '[Sign In Module] sign in success';
export const USER_SIGN_IN_FAILURE = '[Sign In Module] sign in failure';

// COMMON
export const setSpinnerState = createAction(
  SET_SPINNER_STATE,
  props<{ state: boolean }>()
);

export const updateUserData = createAction(UPDATE_USER_DATA);

export const setUserData = createAction(
  SET_USER_DATA,
  props<{ data: IUser }>()
);

// SIGN IN ACTIONS
export const signIn = createAction(
  USER_SIGN_IN,
  props<{ data: UserSignInDto }>()
);

export const signInSuccess = createAction(USER_SIGN_IN_SUCCESS);

export const signInFailed = createAction(USER_SIGN_IN_FAILURE);

// PROFILE ACTIONS
