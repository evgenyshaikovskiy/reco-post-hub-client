import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IHashtag } from '../interfaces/request-interfaces';
import { Observable } from 'rxjs';
import { AUTH_CONTEXT } from '../interceptors/intercept.context';

@Injectable({ providedIn: 'root' })
export class HomeService {
  constructor(private readonly http: HttpClient) {}

  public getAllHashtags(): Observable<IHashtag[]> {
    return this.http.get<IHashtag[]>('hashtag/all');
  }

  public getPersonalizedRecommendations(): Observable<IHashtag[]> {
    return this.http.get<IHashtag[]>('recommended-hashtags', {
      context: AUTH_CONTEXT,
    });
  }
}
