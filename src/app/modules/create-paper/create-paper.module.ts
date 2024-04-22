import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePaperComponent } from './create-paper/create-paper.component';
import { EditorModule } from '../editor/editor.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextSelectionDialogComponent } from '../../components/text-selection-dialog/text-selection-dialog.component';
import { ButtonModule } from 'primeng/button';
import { HashtagComponent } from '../../components/hashtag/hashtag.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';

const routes: Routes = [{ path: '', component: CreatePaperComponent }];

@NgModule({
  declarations: [CreatePaperComponent],
  imports: [
    ButtonModule,
    HashtagComponent,
    OverlayPanelModule,
    InputTextModule,
    TextSelectionDialogComponent,
    CommonModule,
    EditorModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [],
})
export class CreatePaperModule {}
