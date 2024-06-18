import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule, Routes } from '@angular/router';
import { profilePageResolver } from './profile.resolver';
import { profilePageGuard } from './profile-guard';
import { ButtonModule } from 'primeng/button';
import { HashtagListComponent } from '../../components/hashtag-list/hashtag-list.component';

const routes: Routes = [
  {
    path: ':username',
    component: ProfileComponent,
    canActivate: [profilePageGuard],
    resolve: { data: profilePageResolver },
  },
];

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule.forChild(routes),
    HashtagListComponent,
  ],
  providers: [],
})
export class ProfileModule {}
