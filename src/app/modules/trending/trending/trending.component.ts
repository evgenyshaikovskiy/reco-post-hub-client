import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ITopic } from '../../../core/interfaces/request-interfaces';
import { TopicsService } from '../../topics/topics.service';
import { Store } from '@ngrx/store';
import { setSpinnerState } from '../../../store/actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FilterRule } from '../../../core/utility/interfaces';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrl: './trending.component.scss',
})
export class TrendingComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  public topics: ITopic[] = [];

  constructor(
    private readonly topicService: TopicsService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(setSpinnerState({ state: true }));
    this.topicService
      .getTopics(
        { size: 10, page: 0 },
        { property: 'published', rule: FilterRule.EQUALS, value: 'true' },
        { property: 'totalScore', direction: 'desc' }
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.topics = [...value.items];
        this.store.dispatch(setSpinnerState({ state: false }));
      });
  }
}
