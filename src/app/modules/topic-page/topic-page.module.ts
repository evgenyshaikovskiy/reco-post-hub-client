import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicPageComponent } from './topic-page.component';
import { TopicPageService } from './topic.service';
import { topicPageResolver } from './topic-resolver';
import { TopicContentComponent } from '../../components/topic-content/topic-content.component';

const routes: Routes = [
  {
    path: ':url',
    component: TopicPageComponent,
    resolve: { topic: topicPageResolver },
  },
];

@NgModule({
  declarations: [TopicPageComponent],
  imports: [RouterModule.forChild(routes), TopicContentComponent],
  providers: [TopicPageService],
})
export class TopicPageModule {}
