import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUpdateUserDto } from '../../modules/profile/dtos';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { AUTH_CONTEXT } from '../interceptors/intercept.context';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private readonly _http: HttpClient) {}

  public updateProfilePicture(dto: IUpdateUserDto): Observable<IUser> {
    return this._http.patch<IUser>('user', dto, {
      context: AUTH_CONTEXT,
    });
  }
}
