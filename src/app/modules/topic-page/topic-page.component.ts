import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { IPublicTopic } from '../../core/interfaces/request-interfaces';

@Component({
  selector: 'app-topic-page',
  templateUrl: './topic-page.component.html',
  styleUrls: ['./topic-page.component.scss'],
})
export class TopicPageComponent {
  private destroyRef = inject(DestroyRef);

  public topic!: IPublicTopic;

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.topic = data['topic'];
      });
  }
}
