import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { originApiInterceptor } from './core/interceptors/origin.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ApplicationEffects } from './store/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { reducers } from './store';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })
    ),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([originApiInterceptor, authInterceptor])
    ),
    MessageService,
    DialogService,
    provideStore(reducers),
    provideStoreDevtools(),
    provideEffects([ApplicationEffects]),
  ],
};
