import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AUTH_CONTEXT } from '../interceptors/intercept.context';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResourcesService {
  constructor(private readonly _http: HttpClient) {}

  public loadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this._http.post<string>('upload-profile-picture', formData, {
      context: AUTH_CONTEXT,
      responseType: 'text' as 'json',
    });
  }

  public getFileByName(filename: string): Observable<unknown> {
    return this._http.get('resource/' + filename);
  }
}
