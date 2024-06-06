import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  share,
  Subscription,
  switchMap,
  timer,
} from 'rxjs';
import { INotification } from '../types/types';
import { AUTH_CONTEXT } from '../interceptors/intercept.context';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _longPollingTimer: number = 60_000;
  private _subscription!: Subscription;
  private destroyRef: DestroyRef = inject(DestroyRef);

  private _notifications$: BehaviorSubject<INotification[]> =
    new BehaviorSubject([] as INotification[]);

  public notifications$ = this._notifications$.asObservable().pipe(share());

  constructor(private readonly http: HttpClient) {}

  // fetch notification, set them, start polling
  public configure() {
    console.log('configure');
    this.getNotifications()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(notifications => this.updateNotifications(notifications));

    this._startPolling();
  }

  public stopFetchingNotifications() {
    this._notifications$.next([]);
    this._stopPolling();
  }

  public getNotifications(): Observable<INotification[]> {
    return this.http.get<INotification[]>('notification', {
      context: AUTH_CONTEXT,
    });
  }

  public markNotificationAsViewed(id: string): Observable<INotification> {
    return this.http.patch<INotification>(
      `notification/${id}`,
      {},
      { context: AUTH_CONTEXT }
    );
  }

  private _getNotificationPoll(): Observable<INotification[]> {
    return timer(0, this._longPollingTimer).pipe(
      switchMap(() =>
        this.http.get<INotification[]>('notification', {
          context: AUTH_CONTEXT,
        })
      ),
      catchError(() => {
        this._stopPolling();
        return [];
      })
    );
  }

  private _startPolling() {
    this._subscription = this._getNotificationPoll().subscribe(notifications =>
      this.updateNotifications(notifications)
    );
  }

  private _stopPolling() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  public updateNotifications(notifications: INotification[]) {
    this._notifications$.next([...notifications]);
  }
}
