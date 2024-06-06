import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HashtagTopicsComponent } from './hashtag-topics.component';
import { TopicPreviewComponent } from '../../components/topic-preview/topic-preview.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


const routes: Routes = [
  { path: ':encodedHashtags', component: HashtagTopicsComponent },
];
@NgModule({
  declarations: [HashtagTopicsComponent],
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    ProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    TopicPreviewComponent,
    InputTextModule,
    RouterModule.forChild(routes),
  ],
})
export class HashtagTopicsModule {}
