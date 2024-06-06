import { Component, Input } from '@angular/core';
import { ITopic } from '../../core/interfaces/request-interfaces';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { RatingPipe } from './rating-pipe';
import { HashtagListComponent } from '../hashtag-list/hashtag-list.component';

@Component({
  selector: 'app-topic-preview',
  standalone: true,
  imports: [
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    RatingPipe,
    HashtagListComponent,
    RouterModule,
  ],
  providers: [],
  templateUrl: './topic-preview.component.html',
  styleUrls: ['./topic-preview.component.scss'],
})
export class TopicPreviewComponent {
  @Input({ required: true }) topic!: ITopic;

  constructor(private readonly router: Router) {}

  public navigateToTopicPage(): void {
    this.router.navigate([`topic/${this.topic.url}`]);
  }

  public navigateToAuthor(): void {
    this.router.navigate([`profile/${this.topic.author.username}`]);
  }
}
