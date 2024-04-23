import { NgModule } from '@angular/core';
import { TopicsComponent } from './topics/topics.component';
import { RouterModule, Routes } from '@angular/router';
import { TopicsService } from './topics.service';
import { TopicPreviewComponent } from '../../components/topic-preview/topic-preview.component';

const routes: Routes = [{ path: '', component: TopicsComponent }];

@NgModule({
  declarations: [TopicsComponent],
  imports: [RouterModule.forChild(routes), TopicPreviewComponent],
  providers: [TopicsService],
})
export class TopicsModule {}
