import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
  IHashtag,
  IPublicUser,
} from '../../core/interfaces/request-interfaces';
import { CommonModule } from '@angular/common';
import { HashtagListComponent } from '../hashtag-list/hashtag-list.component';

@Component({
  selector: 'app-topic-content',
  standalone: true,
  imports: [CommonModule, HashtagListComponent],
  templateUrl: './topic-content.component.html',
  styleUrls: ['./topic-content.component.scss'],
})
export class TopicContentComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) htmlContent!: string;
  @Input({ required: true }) user!: IPublicUser;
  @Input({ required: true }) createdAt!: Date;
  @Input({ required: true }) hashtags!: IHashtag[];

  @Input() isPreview!: boolean;

  @ViewChild('topicHtml') topicHtmlContent!: ElementRef;
}
