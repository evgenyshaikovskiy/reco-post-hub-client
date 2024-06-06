import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { UserSignUpDto } from '../interfaces/user-sign-up.interface';
import { Observable, catchError, finalize, map, of } from 'rxjs';
import { UserSignInDto } from '../interfaces/user-sign-in.interface';
import { IAuthResult } from '../interfaces/auth-result.interface';
import {
  ACCESS_TOKEN_EXPIRES_AT_LOCAL_STORAGE_KEY,
  ACCESS_TOKEN_LOCAL_STORAGE_KEY,
  REFRESH_TOKEN_EXPIRES_AT_LOCAL_STORAGE_KEY,
  REFRESH_TOKEN_LOCAL_STORAGE_KEY,
} from '../consts/keys';
import { IUser, UserRole } from '../interfaces/user.interface';
import { LogOutDto, RefreshTokenDto } from '../interfaces/refresh-token.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import moment from 'moment';
import { AUTH_CONTEXT } from '../interceptors/intercept.context';
import { Store } from '@ngrx/store';
import { getUserInfo } from '../../store/selectors';
import { setUserData } from '../../store/actions';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _destroyRef = inject(DestroyRef);

  private _user?: IUser;

  public get User(): IUser | null {
    return this._user ?? null;
  }

  public get isAllowedToReviewTopic(): boolean {
    return (
      this._user?.role === UserRole.ADMIN || this._user?.role === UserRole.MOD
    );
  }

  constructor(
    private readonly _http: HttpClient,
    private readonly store: Store,
    private readonly notificationService: NotificationService,
  ) {
    this.store
      .select(getUserInfo)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(user => {
        this._user = user;
      });
  }

  public signUp(dto: UserSignUpDto): Observable<string> {
    return this._http
      .post<string>('auth/sign-up', dto, {
        responseType: 'text' as 'json',
      })
      .pipe(takeUntilDestroyed(this._destroyRef));
  }

  public signIn(dto: UserSignInDto): Observable<IAuthResult | null> {
    return this._http.post<IAuthResult>('auth/sign-in', dto).pipe(
      takeUntilDestroyed(this._destroyRef),
      catchError(() => {
        return of(null);
      })
    );
  }

  public refresh(): Observable<IAuthResult> {
    const refreshToken =
      localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY) ?? '';

    const dto: RefreshTokenDto = {
      refreshToken: refreshToken,
    };

    return this._http
      .post<IAuthResult>('auth/refresh', dto)
      .pipe(takeUntilDestroyed(this._destroyRef));
  }

  public logOut(): Observable<string> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY);

    if (!refreshToken) {
      return of('Error during logout action');
    }

    const dto: LogOutDto = {
      refreshToken,
    };

    return this._http
      .post<string>('auth/logout', dto, {
        responseType: 'text' as 'json',
      })
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        finalize(() => {
          this._clearAfterLogout();
          this.notificationService.stopFetchingNotifications();
        })
      );
  }

  public setSession(authResult: IAuthResult) {
    localStorage.setItem(
      ACCESS_TOKEN_LOCAL_STORAGE_KEY,
      authResult.accessToken.token
    );
    localStorage.setItem(
      ACCESS_TOKEN_EXPIRES_AT_LOCAL_STORAGE_KEY,
      String(authResult.accessToken.expiredAt)
    );

    localStorage.setItem(
      REFRESH_TOKEN_LOCAL_STORAGE_KEY,
      authResult.refreshToken.token
    );
    localStorage.setItem(
      REFRESH_TOKEN_EXPIRES_AT_LOCAL_STORAGE_KEY,
      String(authResult.refreshToken.expiredAt)
    );

    this._user = { ...authResult.user };
  }

  public isLoggedIn(): boolean {
    const expiration = this.getExpiration();
    if (expiration) {
      const before = moment().isBefore(expiration);
      return before;
    }

    return false;
  }

  public isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  public getExpiration(): moment.Moment | null {
    const expiration = localStorage.getItem(
      ACCESS_TOKEN_EXPIRES_AT_LOCAL_STORAGE_KEY
    );
    return expiration ? moment(JSON.parse(expiration)) : null;
  }

  public fetchUser(): Observable<IUser> {
    return this._http.get<IUser>(`user`, { context: AUTH_CONTEXT });
  }

  public configure(): Observable<boolean> {
    if (this.isLoggedIn() && !this.User) {
      return this.fetchUser().pipe(
        map(user => {
          this.store.dispatch(setUserData({ data: user }));
          this.notificationService.configure();
          return true;
        })
      );
    }

    if (this.isLoggedIn() && this.User) {
      this.notificationService.configure();
    }

    return of(false);
  }

  private _clearAfterLogout() {
    localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY);
    localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_LOCAL_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_LOCAL_STORAGE_KEY);
  }
}
