/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IPaginatedData, IPagination } from '../../core/utility/interfaces';
import { IHashtag } from '../../core/interfaces/request-interfaces';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private readonly http: HttpClient) {}

  public searchByPrompt(_prompt?: string): Observable<unknown> {
    return of('cool');
  }

  public searchHashtag(
    prompt: string,
    paginationParams: IPagination = { size: 10, page: 0 }
  ): Observable<IPaginatedData<IHashtag>> {
    const spreaded: any = {
      ...paginationParams,
    };
    const resource = new URLSearchParams(spreaded);

    return this.http.get<IPaginatedData<IHashtag>>(
      `hashtag?${resource.toString()}&filter=name:like:${prompt}`
    );
  }
}
