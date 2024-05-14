import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  IComment,
  IScore,
  ITopic,
} from '../../core/interfaces/request-interfaces';
import { TopicPageService } from '../../core/services/topic.service';
import { AuthService } from '../../core/services/auth.service';
import { extractTextFromHtml } from '../../core/utility/extract-text';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { setUserData } from '../../store/actions';
import { IUser } from '../../core/interfaces/user.interface';

@Component({
  selector: 'app-topic-page',
  templateUrl: './topic-page.component.html',
  styleUrls: ['./topic-page.component.scss'],
})
export class TopicPageComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  public topic!: ITopic;
  public comments!: IComment[];

  public get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public relativeScore$: BehaviorSubject<IScore | null> =
    new BehaviorSubject<IScore | null>(null);

  constructor(
    private activatedRoute: ActivatedRoute,
    private topicPageService: TopicPageService,
    private authService: AuthService,
    private store: Store
  ) {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.topic = data['data']['topic'];
        this.comments = data['data']['comments'] ?? [];
      });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn() && !this.authService.User) {
      this.authService
        .fetchUser()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(user => {
          this.store.dispatch(setUserData({ data: user }));
          console.log('here');
          this._findRelativeScore(user);
        });
    }

    if (this.authService.User) {
      this._findRelativeScore(this.authService.User);
    }
  }

  private _findRelativeScore(user: IUser): void {
    const relativeScore = user.scores.find(
      score => score.topic.topicId === this.topic.topicId
    );

    this.relativeScore$.next(relativeScore ?? null);
  }

  public sendComment(data: { htmlContent: string; mentions: string[] }) {
    console.log(data, this.authService.User);
    if (this.authService.User) {
      this.topicPageService
        .writeCommentToTopic({
          authorId: this.authService.User.id,
          htmlContent: data.htmlContent,
          textContent: extractTextFromHtml(data.htmlContent),
          topicId: this.topic.topicId,
          mentionedProfileIds: [],
        })
        .subscribe(comment => {
          console.log('new comment', comment);
        });
    }
  }
}
