import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

const routes: Routes = [{ path: '', component: SettingsComponent }];

@NgModule({
  declarations: [SettingsComponent],
  imports: [CommonModule, FileUploadModule, RouterModule.forChild(routes)],
  providers: [],
})
export class SettingsModule {}
