import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { UserSignUpDto } from '../interfaces/user-sign-up.interface';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  map,
  of,
} from 'rxjs';
import { UserSignInDto } from '../interfaces/user-sign-in.interface';
import { IAuthResult } from '../interfaces/auth-result.interface';
import {
  ACCESS_TOKEN_EXPIRES_AT_LOCAL_STORAGE_KEY,
  ACCESS_TOKEN_LOCAL_STORAGE_KEY,
  REFRESH_TOKEN_EXPIRES_AT_LOCAL_STORAGE_KEY,
  REFRESH_TOKEN_LOCAL_STORAGE_KEY,
} from '../consts/keys';
import { SUCCESS_LOGIN_MESSAGE } from '../consts/consts';
import { IUser } from '../interfaces/user.interface';
import { LogOutDto, RefreshTokenDto } from '../interfaces/refresh-token.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import moment from 'moment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _destroyRef = inject(DestroyRef);

  private _isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  private _user?: IUser;

  public isLoggedIn$ = this._isLoggedIn$.asObservable();

  public get User(): IUser | null {
    return this._user ?? null;
  }

  constructor(private readonly _http: HttpClient) {}

  public signUp(dto: UserSignUpDto): Observable<string> {
    return this._http
      .post<string>('auth/sign-up', dto, {
        responseType: 'text' as 'json',
      })
      .pipe(takeUntilDestroyed(this._destroyRef));
  }

  public signIn(dto: UserSignInDto): Observable<string> {
    return this._http.post<IAuthResult>('auth/sign-in', dto).pipe(
      takeUntilDestroyed(this._destroyRef),
      map(authResult => {
        console.log(authResult);
        this.setSession(authResult);
        return SUCCESS_LOGIN_MESSAGE;
      }),
      catchError(err => {
        return of(`${err.error.error}: ${err.error.message}`);
      })
    );
  }

  public refresh(): Observable<IAuthResult> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY) ?? "";

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
      String(authResult.accessToken.expiresAt)
    );

    localStorage.setItem(
      REFRESH_TOKEN_LOCAL_STORAGE_KEY,
      authResult.refreshToken.token
    );
    localStorage.setItem(
      REFRESH_TOKEN_EXPIRES_AT_LOCAL_STORAGE_KEY,
      String(authResult.refreshToken.expiresAt)
    );

    this._user = { ...authResult.user };
    this._isLoggedIn$.next(true);
  }

  public isLoggedIn(): boolean {
    return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  public getExpiration(): moment.Moment {
    const expiration =
      localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_LOCAL_STORAGE_KEY) ?? '0';
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  private _clearAfterLogout() {
    localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY);
    localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_LOCAL_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_LOCAL_STORAGE_KEY);
    this._user = undefined;
    this._isLoggedIn$.next(false);
  }
}
