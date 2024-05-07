import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IComment,
  IPublicTopic,
} from '../../core/interfaces/request-interfaces';
import { ICreateCommentDto } from './dtos';
import { AUTH_INTERCEPT } from '../../core/interceptors/intercept.context';

@Injectable()
export class TopicPageService {
  constructor(private readonly http: HttpClient) {}

  public getTopicByUrl(url: string): Observable<IPublicTopic> {
    return this.http.get<IPublicTopic>(`topic/${url}`);
  }

  public getTopicComments(topicId: string): Observable<IComment[]> {
    return this.http.get<IComment[]>(`comment/${topicId}`);
  }

  public writeCommentToTopic(dto: ICreateCommentDto): Observable<IComment> {
    const context = new HttpContext();
    context.set(AUTH_INTERCEPT, true);
    return this.http.post<IComment>('comment', dto, { context });
  }
}
