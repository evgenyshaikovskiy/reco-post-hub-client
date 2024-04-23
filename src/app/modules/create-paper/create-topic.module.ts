import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTopicComponent } from './create-topic/create-topic.component';
import { EditorModule } from '../editor/editor.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextSelectionDialogComponent } from '../../components/text-selection-dialog/text-selection-dialog.component';
import { ButtonModule } from 'primeng/button';
import { HashtagComponent } from '../../components/hashtag/hashtag.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
import { CreateTopicService } from './create-topic.service';
import { TopicContentComponent } from '../../components/topic-content/topic-content.component';

const routes: Routes = [{ path: '', component: CreateTopicComponent }];

@NgModule({
  declarations: [CreateTopicComponent],
  imports: [
    ButtonModule,
    HashtagComponent,
    TopicContentComponent,
    OverlayPanelModule,
    InputTextModule,
    TextSelectionDialogComponent,
    CommonModule,
    EditorModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [CreateTopicService],
})
export class CreateTopicModule {}
