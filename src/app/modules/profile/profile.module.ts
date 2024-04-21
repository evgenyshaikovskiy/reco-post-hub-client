import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
];

@NgModule({
  declarations: [ProfileComponent, SettingsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ProfileModule {}
