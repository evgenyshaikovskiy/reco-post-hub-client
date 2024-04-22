import { HttpClient, HttpContext } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { CreatePaperDto } from './create-paper/paper-dtos';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AUTH_INTERCEPT } from '../../core/interceptors/intercept.context';
import { Observable } from 'rxjs';

export interface CreatePaperResponse {
  authorId: string;
  createdAt: string;
  hashtags: string[];
  htmlContent: string;
  paperId: string;
  summarization: string;
  textContent: string;
  title: string;
  updatedAt: string;
  url: string;
}

@Injectable()
export class CreatePaperService {
  private _destroyRef = inject(DestroyRef);

  constructor(private readonly _http: HttpClient) {}

  public createPaper(dto: CreatePaperDto): Observable<CreatePaperResponse> {
    const context = new HttpContext();
    context.set(AUTH_INTERCEPT, true);
    return this._http
      .post<CreatePaperResponse>('paper', dto, { context })
      .pipe(takeUntilDestroyed(this._destroyRef));
  }
}
