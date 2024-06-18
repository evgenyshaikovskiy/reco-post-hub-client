import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, timer } from 'rxjs';
import { IComment, ITopic } from '../interfaces/request-interfaces';
import {
  ICreateAnswerDto,
  ICreateCommentDto,
  IUpdateTopicDto,
} from '../../modules/topic-page/dtos';
import { AUTH_INTERCEPT } from '../interceptors/intercept.context';

@Injectable({ providedIn: 'root' })
export class TopicPageService {
  private _longPollingTimer: number = 60_000;

  constructor(private readonly http: HttpClient) {}

  public getTopicByUrl(url: string): Observable<ITopic> {
    const context = new HttpContext();
    context.set(AUTH_INTERCEPT, true);
    return this.http.get<ITopic>(`topic/${url}`, { context });
  }

  public writeCommentToTopic(dto: ICreateCommentDto): Observable<IComment> {
    const context = new HttpContext();
    context.set(AUTH_INTERCEPT, true);
    return this.http.post<IComment>('comment', dto, { context });
  }

  public writeReplyToCommentTopic(dto: ICreateAnswerDto): Observable<IComment> {
    const context = new HttpContext();
    context.set(AUTH_INTERCEPT, true);
    return this.http.post<IComment>(`comment/${dto.parentCommentId}`, dto, {
      context,
    });
  }

  public updateTopic(id: string, dto: IUpdateTopicDto): Observable<ITopic> {
    const context = new HttpContext();
    context.set(AUTH_INTERCEPT, true);
    return this.http.patch<ITopic>(`topic/${id}`, dto, { context });
  }

  public removeTopic(id: string): Observable<ITopic> {
    const context = new HttpContext();
    context.set(AUTH_INTERCEPT, true);
    return this.http.delete<ITopic>(`topic/${id}`, { context });
  }

  public getCommentsPoll(topicId: string): Observable<IComment[]> {
    return timer(0, this._longPollingTimer).pipe(
      switchMap(() => this.http.get<IComment[]>(`comment/${topicId}`)),
      catchError(() => {
        return [];
      })
    );
  }

  public getComments(topicId: string): Observable<IComment[]> {
    return this.http.get<IComment[]>(`comment/${topicId}`);
  }
}
