import { NgModule } from '@angular/core';
import { SignInComponent } from './sign-in.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [{ path: '', component: SignInComponent }];

@NgModule({
  declarations: [SignInComponent],
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    RouterModule.forChild(routes),
  ],
})
export class SignInModule {}
