import { NgModule } from '@angular/core';
import { TrendingComponent } from './trending/trending.component';
import { RouterModule, Routes } from '@angular/router';
import { TopicPreviewComponent } from '../../components/topic-preview/topic-preview.component';

const routes: Routes = [{ path: '', component: TrendingComponent }];

@NgModule({
  declarations: [TrendingComponent],
  imports: [RouterModule.forChild(routes), TopicPreviewComponent],
})
export class TrendingModule {}
