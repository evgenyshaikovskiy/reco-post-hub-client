import { Component, Input } from '@angular/core';
import { IPublicTopic } from '../../core/interfaces/request-interfaces';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-topic-preview',
  standalone: true,
  imports: [CommonModule, OverlayPanelModule, ButtonModule, RouterModule],
  providers: [],
  templateUrl: './topic-preview.component.html',
  styleUrls: ['./topic-preview.component.scss'],
})
export class TopicPreviewComponent {
  @Input({ required: true }) topic!: IPublicTopic;

  constructor(private readonly router: Router) {}

  public navigateToTopicPage(): void {
    this.router.navigate([`topic/${this.topic.url}`]);
  }
}
