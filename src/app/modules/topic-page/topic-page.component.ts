import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IComment,
  IScore,
  ITopic,
} from '../../core/interfaces/request-interfaces';
import { TopicPageService } from '../../core/services/topic.service';
import { AuthService } from '../../core/services/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { IUser } from '../../core/interfaces/user.interface';
import { setSpinnerState } from '../../store/actions';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';

@Component({
  selector: 'app-topic-page',
  templateUrl: './topic-page.component.html',
  styleUrls: ['./topic-page.component.scss'],
})
export class TopicPageComponent implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);
  private subscription!: Subscription;

  public topic!: ITopic;
  public comments!: IComment[];

  public get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public get isAllowedToReview(): boolean {
    return this.isLoggedIn && this.authService.isAllowedToReviewTopic;
  }

  public relativeScore$: BehaviorSubject<IScore | null> =
    new BehaviorSubject<IScore | null>(null);

  constructor(
    private activatedRoute: ActivatedRoute,
    private topicPageService: TopicPageService,
    private authService: AuthService,
    private notificationService: ToastNotificationsService,
    private router: Router,
    private store: Store
  ) {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.topic = data['data']['topic'];
        this.comments = data['data']['comments'];
      });
  }

  ngOnInit(): void {
    if (this.authService.User) {
      this._findRelativeScore(this.authService.User);
    }

    this._startPolling();
  }

  ngOnDestroy(): void {
    this._stopPolling();
  }

  private _startPolling() {
    this.subscription = this.topicPageService
      .getCommentsPoll(this.topic.topicId)
      .subscribe(comments => {
        this.comments = comments;
      });
  }

  private _stopPolling() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private _findRelativeScore(user: IUser): void {
    const relativeScore = user.scores.find(
      score => score.topic.topicId === this.topic.topicId
    );

    console.log('scores', relativeScore);

    this.relativeScore$.next(relativeScore ?? null);
  }

  public sendComment(data: { htmlContent: string; textContent: string }) {
    if (this.authService.User) {
      this.topicPageService
        .writeCommentToTopic({
          ...data,
          topicId: this.topic.topicId,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() =>
          this.notificationService.showNotification(
            'success',
            'Comment is added'
          )
        );
    }
  }

  public sendReply(data: {
    htmlContent: string;
    textContent: string;
    parentCommentId: string;
  }) {
    if (this.authService.User) {
      this.topicPageService
        .writeReplyToCommentTopic({
          ...data,
          topicId: this.topic.topicId,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() =>
          this.notificationService.showNotification(
            'success',
            'You have replied to comment'
          )
        );
    }
  }

  public submit() {
    this.store.dispatch(setSpinnerState({ state: true }));
    this.topicPageService
      .updateTopic(this.topic.topicId, { published: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(topic => {
        this.notificationService.showNotification(
          'success',
          `${topic.title} was published!`
        );
        this.router.navigate(['review']);
        this.store.dispatch(setSpinnerState({ state: false }));
      });
  }

  public remove() {
    this.store.dispatch(setSpinnerState({ state: true }));
    this.topicPageService
      .removeTopic(this.topic.topicId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(topic => {
        this.notificationService.showNotification(
          'success',
          `${topic.title} was removed!`
        );
        this.router.navigate(['review']);
        this.store.dispatch(setSpinnerState({ state: false }));
      });
  }
}
