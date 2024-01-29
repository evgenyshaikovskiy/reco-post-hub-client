import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserSignUpDto } from '../interfaces/user-sign-up.interface';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { UserSignInDto } from '../interfaces/user-sign-in.interface';
import { IAuthResult } from '../interfaces/auth-result.interface';
import {
  ACCESS_TOKEN_LOCAL_STORAGE_KEY,
  REFRESH_TOKEN_LOCAL_STORAGE_KEY,
} from '../consts/keys';
import { SUCCESS_LOGIN_MESSAGE } from '../consts/consts';
import { IUser } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
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
    return this._http.post<string>('auth/sign-up', dto, {
      responseType: 'text' as 'json',
    });
  }

  public signIn(dto: UserSignInDto): Observable<string> {
    return this._http.post<IAuthResult>('auth/sign-in', dto).pipe(
      map(authResult => {
        this._saveTokenMetadata(authResult);
        return SUCCESS_LOGIN_MESSAGE;
      }),
      catchError(err => {
        return of(`${err.error.error}: ${err.error.message}`);
      })
    );
  }

  private _saveTokenMetadata(authResult: IAuthResult) {
    localStorage.setItem(
      ACCESS_TOKEN_LOCAL_STORAGE_KEY,
      authResult.accessToken
    );
    localStorage.setItem(
      REFRESH_TOKEN_LOCAL_STORAGE_KEY,
      authResult.refreshToken
    );

    this._user = { ...authResult.user };
  }
}
