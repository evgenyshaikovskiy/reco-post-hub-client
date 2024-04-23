import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPublicTopic } from '../../core/interfaces/request-interfaces';

@Injectable()
export class TopicPageService {
  constructor(private readonly http: HttpClient) {}

  public getTopicByUrl(url: string): Observable<IPublicTopic> {
    return this.http.get<IPublicTopic>(`topic/${url}`);
  }
}
