import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HashtagListComponent } from '../../components/hashtag-list/hashtag-list.component';
import { TopicPreviewComponent } from '../../components/topic-preview/topic-preview.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HashtagListComponent,
    TopicPreviewComponent,
    ProgressSpinnerModule,
  ],
})
export class HomeModule {}
