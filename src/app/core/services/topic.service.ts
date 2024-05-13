import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IComment, ITopic } from '../interfaces/request-interfaces';
import { ICreateCommentDto } from '../../modules/topic-page/dtos';
import { AUTH_INTERCEPT } from '../interceptors/intercept.context';

@Injectable({ providedIn: 'root' })
export class TopicPageService {
  constructor(private readonly http: HttpClient) {}

  public getTopicByUrl(url: string): Observable<ITopic> {
    const context = new HttpContext();
    context.set(AUTH_INTERCEPT, true);
    return this.http.get<ITopic>(`topic/${url}`, { context });
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
