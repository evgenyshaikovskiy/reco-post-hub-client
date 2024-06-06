import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewComponent } from './review.component';
import { TopicPreviewComponent } from '../../components/topic-preview/topic-preview.component';

const routes: Routes = [{ path: '', component: ReviewComponent }];

@NgModule({
  declarations: [ReviewComponent],
  imports: [
    CommonModule,
    RouterModule,
    TopicPreviewComponent,
    RouterModule.forChild(routes),
  ],
  providers: [],
})
export class ReviewModule {}
