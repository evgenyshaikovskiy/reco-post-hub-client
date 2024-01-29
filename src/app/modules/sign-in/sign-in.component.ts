import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';
import { Router } from '@angular/router';
import { UserSignInDto } from '../../core/interfaces/user-sign-in.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { SUCCESS_LOGIN_MESSAGE } from '../../core/consts/consts';
import { markAllAsDirty } from '../../core/utility';

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

  private _destroyRef = inject(DestroyRef);

  constructor(
    private readonly _fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly toastNotificationsService: ToastNotificationsService,
    private readonly router: Router
  ) {}

  public onFormSubmit() {

    console.log(this.form);
    if (this.form.valid) {
      const formValues = this.form.getRawValue();
      const dto: UserSignInDto = {
        ...formValues,
      };

      console.log('here');

      this.isLoading = true;
      this.authService
        .signIn(dto)
        .pipe(
          takeUntilDestroyed(this._destroyRef),
          finalize(() => (this.isLoading = false))
        )
        .subscribe(result => {
          // TODO: refactor this logic without ifs
          if (result === SUCCESS_LOGIN_MESSAGE) {
            this.toastNotificationsService.showNotification(
              'success',
              'You were logged in successfully'
            );
          } else {
            this.toastNotificationsService.showNotification('info', result);
            this.form.reset();
          }
        });
    } else {
      markAllAsDirty(this.form);
    }
  }

  protected _navigateToSignUp() {
    this.router.navigate(['sign-up']);
  }

}
