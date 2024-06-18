import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { HomeService } from '../../../core/services/home.service';
import { Store } from '@ngrx/store';
import { setSpinnerState } from '../../../store/actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, filter, finalize, switchMap, tap } from 'rxjs';
import { IHashtag, ITopic } from '../../../core/interfaces/request-interfaces';
import { AuthService } from '../../../core/services/auth.service';
import { TopicsService } from '../../topics/topics.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  public hashtags: IHashtag[] = [];
  public personalizedTopics: ITopic[] = [];
  public personalizedHashtags$: BehaviorSubject<IHashtag[]> =
    new BehaviorSubject<IHashtag[]>([] as IHashtag[]);

  public get personalizedHashtags(): IHashtag[] {
    return this.personalizedHashtags$.getValue();
  }
  public get isAuthenticated() {
    return this.authService.User ? true : false;
  }

  public hashtagsLoading = true;
  public topicsLoading = true;

  constructor(
    private readonly service: HomeService,
    private readonly store: Store,
    private readonly authService: AuthService,
    private readonly topicsService: TopicsService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(setSpinnerState({ state: true }));
    this.service
      .getAllHashtags()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.store.dispatch(setSpinnerState({ state: false })))
      )
      .subscribe(hashtags => {
        this.hashtags = [...hashtags];
      });

    if (this.authService.User) {
      this.service
        .getPersonalizedRecommendations()
        .pipe(
          tap(() => {
            this.hashtagsLoading = true;
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(hs => {
          this.personalizedHashtags$.next([...hs]);
          this.hashtagsLoading = false;
        });

      this.personalizedHashtags$
        .pipe(
          filter(hs => hs.length > 0),
          tap(() => {
            this.topicsLoading = true;
          }),
          switchMap(hs =>
            this.topicsService.getTopicsWithHashtags(
              hs.map(h => h.name).join('&')
            )
          ),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(topics => {
          this.personalizedTopics = [...topics];
          this.topicsLoading = false;
        });
    }
  }
}
