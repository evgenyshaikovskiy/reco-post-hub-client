import { NgModule } from '@angular/core';
import { TrendingComponent } from './trending/trending.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: TrendingComponent }];

@NgModule({
  declarations: [TrendingComponent],
  imports: [RouterModule.forChild(routes)],
})
export class TrendingModule {}
