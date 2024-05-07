import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicPageComponent } from './topic-page.component';
import { TopicPageService } from './topic.service';
import { topicPageResolver } from './topic-resolver';
import { TopicContentComponent } from '../../components/topic-content/topic-content.component';
import { CommentSectionComponent } from '../../components/comment-section/comment-section.component';

const routes: Routes = [
  {
    path: ':url',
    component: TopicPageComponent,
    resolve: { data: topicPageResolver },
  },
];

@NgModule({
  declarations: [TopicPageComponent],
  imports: [
    RouterModule.forChild(routes),
    TopicContentComponent,
    CommentSectionComponent,
  ],
  providers: [TopicPageService],
})
export class TopicPageModule {}
