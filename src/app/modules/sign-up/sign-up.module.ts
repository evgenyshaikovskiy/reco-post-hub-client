import { NgModule } from '@angular/core';
import { SignUpComponent } from './sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [{ path: '', component: SignUpComponent }];

@NgModule({
  declarations: [SignUpComponent],
  imports: [
    RouterModule.forChild(routes),
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
})
export class SignUpModule {}
