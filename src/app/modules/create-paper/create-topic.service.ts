import { HttpClient, HttpContext } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { CreateTopicDto } from './create-topic/topic-dtos';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AUTH_INTERCEPT } from '../../core/interceptors/intercept.context';
import { Observable } from 'rxjs';

export interface CreateTopicResponse {
  authorId: string;
  createdAt: string;
  hashtags: string[];
  htmlContent: string;
  topicId: string;
  summarization: string;
  textContent: string;
  title: string;
  updatedAt: string;
  url: string;
}

@Injectable()
export class CreateTopicService {
  private _destroyRef = inject(DestroyRef);

  constructor(private readonly _http: HttpClient) {}

  public createTopic(dto: CreateTopicDto): Observable<CreateTopicResponse> {
    const context = new HttpContext();
    context.set(AUTH_INTERCEPT, true);
    return this._http
      .post<CreateTopicResponse>('topic', dto, { context })
      .pipe(takeUntilDestroyed(this._destroyRef));
  }
}
