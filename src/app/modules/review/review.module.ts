import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewComponent } from './review.component';

const routes: Routes = [{ path: '', component: ReviewComponent }];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule, RouterModule.forChild(routes)],
  providers: [],
})
export class ReviewModule {}
