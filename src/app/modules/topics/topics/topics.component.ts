import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TopicsService } from '../topics.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ITopic } from '../../../core/interfaces/request-interfaces';
import { Store } from '@ngrx/store';
import { setSpinnerState } from '../../../store/actions';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.scss',
})
export class TopicsComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  public topics: ITopic[] = [];

  constructor(
    private readonly topicsService: TopicsService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(setSpinnerState({ state: true }));
    this.topicsService
      .getTopics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.topics = [...value.items];
        this.store.dispatch(setSpinnerState({ state: true }));
        // this.topics = [...value];
      });
  }
}
