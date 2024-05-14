import { NgModule } from '@angular/core';
import { RootComponent } from './root.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./../home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'trending',
        loadChildren: () =>
          import('./../trending/trending.module').then(m => m.TrendingModule),
      },
      {
        path: 'topics',
        loadChildren: () =>
          import('./../topics/topics.module').then(m => m.TopicsModule),
      },
      {
        path: 'sign-in',
        loadChildren: () =>
          import('./../sign-in/sign-in.module').then(m => m.SignInModule),
      },
      {
        path: 'sign-up',
        loadChildren: () =>
          import('./../sign-up/sign-up.module').then(m => m.SignUpModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./../profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./../settings/settings.module').then(m => m.SettingsModule),
        canActivate: [authGuard],
      },
      {
        path: 'create-topic',
        loadChildren: () =>
          import('../create-paper/create-topic.module').then(
            m => m.CreateTopicModule
          ),
        canActivate: [authGuard],
      },
      {
        path: 'topic',
        loadChildren: () =>
          import('../topic-page/topic-page.module').then(
            m => m.TopicPageModule
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [RootComponent],
  imports: [RouterModule.forChild(routes), HeaderComponent],
})
export class RootModule {}
