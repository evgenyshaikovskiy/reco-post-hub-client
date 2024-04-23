import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from '../consts/keys';
import { AUTH_INTERCEPT } from './intercept.context';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastNotificationsService } from '../services/toast-notifications.service';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const token = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
  const shouldIntercept = request.context.has(AUTH_INTERCEPT);

  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(ToastNotificationsService);

  const handleAuthError = (error: { message: string; status: number }) => {
    if (error.status === 401 || error.status === 403) {
      authService.logOut();
      router.navigate(['sign-in']);
      console.log(error);
      notificationService.showNotification(
        'error',
        'Error during communication with API. Check your credentials and sign-in again.'
      );
    }

    return throwError(() => error);
  };

  if (token && shouldIntercept) {
    return next(
      request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token),
      })
    ).pipe(
      catchError(error => {
        if (error.status === 401 || error.status === 403) {
          return authService.refresh().pipe(
            switchMap(authData => {
              console.log(authData);
              authService.setSession(authData);
              request = request.clone({
                headers: request.headers.set(
                  'Authorization',
                  'Bearer ' + authData.accessToken.token
                ),
              });

              return next(request).pipe(
                catchError(error => handleAuthError(error))
              );
            })
          );
        }

        return throwError(() => error);
      })
    );
  }

  return next(request);
};
