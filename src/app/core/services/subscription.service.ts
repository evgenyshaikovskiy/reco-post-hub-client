import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISubscription } from '../interfaces/user.interface';
import { CreateSubscriptionDto } from '../dto/dtos';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AUTH_CONTEXT } from '../interceptors/intercept.context';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private _ref = inject(DestroyRef);
  constructor(private readonly _http: HttpClient) {}

  public addToSubscriptions(dto: CreateSubscriptionDto): Observable<ISubscription> {
    return this._http
      .post<ISubscription>('subscription', dto, { context: AUTH_CONTEXT })
      .pipe(takeUntilDestroyed(this._ref));
  }

  public removeFromSubscriptions(entityId: string): Observable<ISubscription> {
    return this._http
      .delete<ISubscription>(`subscription/${entityId}`, {
        context: AUTH_CONTEXT,
      })
      .pipe(takeUntilDestroyed(this._ref));
  }
}
