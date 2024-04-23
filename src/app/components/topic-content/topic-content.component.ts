import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IPublicUser } from '../../core/interfaces/request-interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topic-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topic-content.component.html',
  styleUrls: ['./topic-content.component.scss'],
})
export class TopicContentComponent implements OnInit {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) htmlContent!: string;
  @Input({ required: true }) user!: IPublicUser;
  @Input({ required: true }) createdAt!: Date;
  @Input({ required: true }) hashtags!: string[];

  @ViewChild('topicHtml') topicHtmlContent!: ElementRef;

  ngOnInit(): void {
    console.log(this.htmlContent);
  }
}
