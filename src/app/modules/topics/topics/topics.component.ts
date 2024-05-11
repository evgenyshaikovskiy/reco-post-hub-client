import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TopicsService } from '../topics.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ITopic } from '../../../core/interfaces/request-interfaces';
import { SpinnerService } from '../../../core/services/spinner.service';

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
    private readonly spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.spinnerService.changeLoadingState(true);
    this.topicsService
      .getTopics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.topics = [...value.items];
        this.spinnerService.changeLoadingState(false);
        // this.topics = [...value];
        // this.spinnerService.changeLoadingState(false);
      });
  }
}
