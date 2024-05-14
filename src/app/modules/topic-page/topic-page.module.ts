import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicPageComponent } from './topic-page.component';
import { TopicPageService } from '../../core/services/topic.service';
import { topicPageResolver } from './topic-resolver';
import { TopicContentComponent } from '../../components/topic-content/topic-content.component';
import { CommentSectionComponent } from '../../components/comment-section/comment-section.component';
import { ScoreComponent } from './components/score.component';

const routes: Routes = [
  {
    path: ':url',
    component: TopicPageComponent,
    resolve: { data: topicPageResolver },
  },
];

@NgModule({
  declarations: [TopicPageComponent, ScoreComponent],
  imports: [
    RouterModule.forChild(routes),
    TopicContentComponent,
    CommentSectionComponent,
  ],
  providers: [TopicPageService],
})
export class TopicPageModule {}
