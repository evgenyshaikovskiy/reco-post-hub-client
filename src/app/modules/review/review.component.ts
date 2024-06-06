import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { TopicsService } from '../topics/topics.service';
import { Store } from '@ngrx/store';
import { setSpinnerState } from '../../store/actions';
import { FilterRule } from '../../core/utility/interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ITopic } from '../../core/interfaces/request-interfaces';
import { Router } from '@angular/router';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  public topics: ITopic[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly topicService: TopicsService,
    private readonly notificationService: ToastNotificationsService,
    private readonly router: Router,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(setSpinnerState({ state: true }));
    this.topicService
      .getTopics(
        { size: 10, page: 0 },
        { property: 'published', rule: FilterRule.EQUALS, value: 'false' },
        { property: 'createdAt', direction: 'desc' }
      )
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(value => {
        this.topics = value.items;
        if (this.topics.length === 0) {
          this.router.navigate(['']);
          this.notificationService.showNotification('info', 'No topics to review');
          
        }
        this.store.dispatch(setSpinnerState({ state: false }));
      });
  }
}
