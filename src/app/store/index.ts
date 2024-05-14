import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { IApp, IAppState } from './app.interface';
import { APP_SHARED_NAME } from './selectors';
import { appReducer } from './reducers';

export const reducers: ActionReducerMap<IApp> = {
  [APP_SHARED_NAME]: appReducer,
};
export const metaReducers: MetaReducer<IAppState>[] = [];
