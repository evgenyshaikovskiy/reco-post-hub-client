import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { IScore } from '../../../core/interfaces/request-interfaces';
import { ScoreService } from '../../../core/services/score.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastNotificationsService } from '../../../core/services/toast-notifications.service';
import { BehaviorSubject } from 'rxjs';

interface IStarState {
  score: number;
  filled: boolean;
}

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
})
export class ScoreComponent implements OnInit {
  @Input({ required: true }) score$!: BehaviorSubject<IScore | null>;
  @Input({ required: true }) topicId!: string;

  private _destroyRef = inject(DestroyRef);

  public stars: IStarState[] = [
    { score: 1, filled: false },
    { score: 2, filled: false },
    { score: 3, filled: false },
    { score: 4, filled: false },
    { score: 5, filled: false },
  ];

  constructor(
    private readonly scoreService: ScoreService,
    private readonly notificationService: ToastNotificationsService
  ) {}

  ngOnInit(): void {
    this.score$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this._setToDefault();
    });
  }

  public hoverMouseOnElement(idx: number) {
    this.stars = this.stars.map((star, arrayIdx) =>
      arrayIdx <= idx ? { ...star, filled: true } : { ...star, filled: false }
    );
  }

  public onStarClick(idx: number) {
    const score = this.stars[idx];
    const currentScore = this.score$.getValue();

    if (!currentScore) {
      this.scoreService
        .giveRating({ score: score.score, topicId: this.topicId })
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(score => {
          this.notificationService.showNotification(
            'success',
            'Thank you for your score'
          );

          this.score$.next(score);
        });

      return;
    }

    if (currentScore && currentScore.score === score.score) {
      this.scoreService
        .removeRating(currentScore.id)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(() => {
          this.notificationService.showNotification(
            'info',
            'You have removed rating for this article.'
          );
          this.score$.next(null);
        });

      return;
    }

    if (currentScore && currentScore.score !== score.score) {
      this.scoreService.updateRating({ score: score.score, topicId: this.topicId})
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(newScore => {
          this.notificationService.showNotification(
            'success',
            'You have updated your rating for this article.'
          );
          this.score$.next(newScore);
        });
      return;
    }
  }

  public leaveMouse() {
    this._setToDefault();
  }

  private _setToDefault() {
    const value = this.score$.getValue();
    if (value) {
      this.stars = this.stars.map(star => ({
        ...star,
        filled: value.score >= star.score,
      }));
    } else {
      this.stars = this.stars.map(star => ({ ...star, filled: false }));
    }
  }
}
