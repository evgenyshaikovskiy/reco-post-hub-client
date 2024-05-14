import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICreateScoreDto } from '../../modules/topic-page/dtos';
import { IScore } from '../interfaces/request-interfaces';
import { Observable } from 'rxjs';
import { AUTH_CONTEXT } from '../interceptors/intercept.context';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  constructor(private readonly _http: HttpClient) {}

  public giveRating(dto: ICreateScoreDto): Observable<IScore> {
    return this._http.post<IScore>('score', dto, { context: AUTH_CONTEXT });
  }

  public updateRating(dto: ICreateScoreDto): Observable<IScore> {
    return this._http.patch<IScore>('score', dto, { context: AUTH_CONTEXT });
  }

  public removeRating(id: string): Observable<IScore> {
    console.log(id);
    return this._http.delete<IScore>(`score/${id}`, { context: AUTH_CONTEXT });
  }
}
