import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPublicTopic } from '../../core/interfaces/request-interfaces';

@Injectable({ providedIn: 'root' })
export class TopicsService {
  constructor(private readonly _http: HttpClient) {}

  public getLastTopics(lastNum: number = 10): Observable<IPublicTopic[]> {
    return this._http.get<IPublicTopic[]>(`topic/last/${lastNum}`);
  }
}
