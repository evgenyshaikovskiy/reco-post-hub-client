import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  IComment,
  IPublicTopic,
} from '../../core/interfaces/request-interfaces';
import { TopicPageService } from './topic.service';
import { AuthService } from '../../core/services/auth.service';
import { extractTextFromHtml } from '../../core/utility/extract-text';

@Component({
  selector: 'app-topic-page',
  templateUrl: './topic-page.component.html',
  styleUrls: ['./topic-page.component.scss'],
})
export class TopicPageComponent {
  private destroyRef = inject(DestroyRef);

  public topic!: IPublicTopic;
  public comments!: IComment[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private topicPageService: TopicPageService,
    private authService: AuthService
  ) {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.topic = data['data']['topic'];
        this.comments = data['data']['comments'] ?? [];
      });
  }

  public sendComment(data: { htmlContent: string; mentions: string[] }) {
    console.log(data, this.authService.User);
    if (this.authService.User) {
      this.topicPageService.writeCommentToTopic({
        authorId: this.authService.User.id,
        htmlContent: data.htmlContent,
        textContent: extractTextFromHtml(data.htmlContent),
        topicId: this.topic.topicId,
        mentionedProfileIds: [],
      }).subscribe((comment) => {
        console.log('new comment', comment);
        
      });
    }
  }
}
