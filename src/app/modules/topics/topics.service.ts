/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPaginatedData, IPagination } from '../../core/utility/interfaces';
import { ITopic } from '../../core/interfaces/request-interfaces';

@Injectable({ providedIn: 'root' })
export class TopicsService {
  constructor(private readonly _http: HttpClient) {}

  public getTopics(
    paginationParams: IPagination = { size: 10, page: 0 }
  ): Observable<IPaginatedData<ITopic>> {
    const spreaded: any = {
      ...paginationParams,
    };
    const resource = new URLSearchParams(spreaded);
    return this._http.get<IPaginatedData<ITopic>>(`topic?${resource.toString()}`);
  }
}
