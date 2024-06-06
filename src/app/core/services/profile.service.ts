import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser, IUserProfile } from '../interfaces/user.interface';
import { AUTH_CONTEXT } from '../interceptors/intercept.context';
import { IUpdateUserDto } from './dto';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private readonly _http: HttpClient) {}

  public updateUserProfile(dto: IUpdateUserDto): Observable<IUser> {
    return this._http.patch<IUser>('user', dto, {
      context: AUTH_CONTEXT,
    });
  }

  public getUserProfile(username: string): Observable<IUserProfile> {
    return this._http.get<IUserProfile>(`user/${username}`);
  }
}
