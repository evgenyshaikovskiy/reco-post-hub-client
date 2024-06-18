import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserSignInDto } from '../../core/interfaces/user-sign-in.interface';
import { markAllAsDirty } from '../../core/utility';
import { Store } from '@ngrx/store';
import { signIn } from '../../store/actions';
import { getSignInFailed } from '../../store/selectors';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  // TODO: add async validators
  public form = this._fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public isLoading: boolean = false;

  public passwordEntryIsIncorrect$ = this.store.select(getSignInFailed);

  constructor(
    private readonly _fb: FormBuilder,
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public onFormSubmit() {
    if (this.form.valid) {
      const formValues = this.form.getRawValue();
      const dto: UserSignInDto = {
        ...formValues,
      };

      this.store.dispatch(signIn({ data: dto }));
    } else {
      markAllAsDirty(this.form);
    }
  }

  protected _navigateToSignUp() {
    this.router.navigate(['sign-up']);
  }

  protected _navigateToForgotPassword(){ 
    this.router.navigate(['forgot-password']);
  }
}
