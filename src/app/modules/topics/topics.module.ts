import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicsComponent } from './topics/topics.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: TopicsComponent }];

@NgModule({
  declarations: [TopicsComponent],
  imports: [RouterModule.forChild(routes)],
})
export class TopicsModule {}
