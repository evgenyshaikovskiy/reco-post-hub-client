/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IFilteringParams,
  IPaginatedData,
  IPagination,
  ISortingParams,
} from '../../core/utility/interfaces';
import { ITopic } from '../../core/interfaces/request-interfaces';
import { AUTH_CONTEXT } from '../../core/interceptors/intercept.context';

@Injectable({ providedIn: 'root' })
export class TopicsService {
  constructor(private readonly _http: HttpClient) {}

  public getTopics(
    paginationParams: IPagination = { size: 10, page: 0 },
    filteringParams?: IFilteringParams,
    sortingParams?: ISortingParams
  ): Observable<IPaginatedData<ITopic>> {
    const spreaded: any = {
      ...paginationParams,
    };

    let filterString = '';
    if (filteringParams) {
      filterString = filteringParams
        ? `&filter=${filteringParams.property}:${filteringParams.rule}:${filteringParams.value}`
        : '';
    }

    let sortingString = '';
    if (sortingParams) {
      sortingString = `&sort=${sortingParams.property}:${sortingParams.direction}`;
    }
    const resource = new URLSearchParams(spreaded);
    return this._http.get<IPaginatedData<ITopic>>(
      `topic?${resource.toString()}${filterString ?? ''}${sortingString ?? ''}`
    );
  }

  public getTopicsForReview(
    paginationParams: IPagination = { size: 10, page: 0 }
  ): Observable<IPaginatedData<ITopic>> {
    const spreaded: any = {
      ...paginationParams,
    };

    const resource = new URLSearchParams(spreaded);
    return this._http.get<IPaginatedData<ITopic>>(
      `topic/review/all${resource.toString()}`,
      { context: AUTH_CONTEXT }
    );
  }
}
