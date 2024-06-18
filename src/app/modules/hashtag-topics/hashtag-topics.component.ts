import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  filter,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { setSpinnerState } from '../../store/actions';
import { TopicsService } from '../topics/topics.service';
import { IHashtag, ITopic } from '../../core/interfaces/request-interfaces';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';
import { FormControl } from '@angular/forms';
import { SearchService } from '../../components/search-bar/search.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-hashtag-topics',
  templateUrl: './hashtag-topics.component.html',
  styleUrl: './hashtag-topics.component.scss',
})
export class HashtagTopicsComponent implements OnInit {
  public topics: ITopic[] = [];
  public requestedHashtags: string[] = [];
  public searchControl: FormControl = new FormControl('');
  private destroyRef = inject(DestroyRef);
  private encodedHashtags$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  public isLoading = false;

  public searchResults: IHashtag[] = [];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store,
    private readonly topicsService: TopicsService,
    private readonly searchService: SearchService,
    private readonly router: Router,
    private readonly notificationService: ToastNotificationsService
  ) {
    this.activatedRoute.paramMap
      .pipe(map(data => data.get('encodedHashtags')!))
      .subscribe(data => this.encodedHashtags$.next(data));
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        filter(prompt => !!prompt && prompt.trim().length >= 1),
        debounceTime(300),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(hashtag => this.searchService.searchHashtag(hashtag)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(paginatedResult => {
        this.isLoading = false;
        this.searchResults = paginatedResult.items;
      });

    this.encodedHashtags$
      .pipe(
        filter(str => !!str),
        tap(() => this.store.dispatch(setSpinnerState({ state: true }))),
        switchMap(encodedHashtags =>
          this.topicsService
            .getTopicsWithHashtags(encodedHashtags)
            .pipe(map(topics => ({ topics, encodedHashtags })))
        ),
        catchError(() => {
          return of({ topics: [] as ITopic[], encodedHashtags: '' });
        })
      )
      .subscribe(data => {
        this.store.dispatch(setSpinnerState({ state: false }));
        this.topics = [...data.topics];
        this.requestedHashtags = data.encodedHashtags.split('&');
      });
  }

  public addHashtag(name: string) {
    if (!this.encodedHashtags$.getValue().includes(name)) {
      this.encodedHashtags$.next(`${this.encodedHashtags$.getValue()}&${name}`);
      this.searchControl.reset();
      this.searchResults = [];
    }
  }
}
