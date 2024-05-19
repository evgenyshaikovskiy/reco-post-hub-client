import { Component, DestroyRef, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { TopicsService } from '../topics/topics.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent {
  private _destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly topicService: TopicsService
  ) {}
}
