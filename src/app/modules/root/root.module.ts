import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootComponent } from './root.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
  },
];

@NgModule({
  declarations: [RootComponent],
  imports: [RouterModule.forChild(routes)],
})
export class RootModule {}
