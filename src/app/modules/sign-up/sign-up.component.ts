import { Component, DestroyRef, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  NAME_REGEX,
  PASSWORD_REGEX,
  SLUG_REGEX,
} from '../../core/consts/regex';
import { passwordShouldMatch } from '../../core/validators/password-should-match';
import { markAllAsDirty } from '../../core/utility';
import { UserSignUpDto } from '../../core/interfaces/user-sign-up.interface';
import { AuthService } from '../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, map, Observable } from 'rxjs';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  // TODO: application terms acceptance, add application terms
  public form = this._fb.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(NAME_REGEX),
      ],
    ],
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(SLUG_REGEX),
      ],
    ],
    email: [
      '',
      [Validators.required, Validators.email],
      [EmailValidator.createValidator(this.authService)],
    ],
    password: this._fb.nonNullable.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(35),
            Validators.pattern(PASSWORD_REGEX),
          ],
        ],
        passwordConfirmation: '',
      },
      {
        validators: passwordShouldMatch,
      }
    ),
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
    if (this.form.valid) {
      const formValues = this.form.getRawValue();
      const dto: UserSignUpDto = {
        ...formValues,
        ...formValues.password,
      };

      this.isLoading = true;
      this.authService
        .signUp(dto)
        .pipe(
          takeUntilDestroyed(this._destroyRef),
          finalize(() => (this.isLoading = false))
        )
        .subscribe({
          next: () => {
            this._resetForm();
            this.toastNotificationsService.showNotification(
              'success',
              'Your registration was successful, check your email account for confirmation link.\nYou will be redirected to sign in page soon...'
            );

            setTimeout(() => this._navigateToSignIn(), 200);
          },
          error: () => {},
        });
    } else {
      markAllAsDirty(this.form);
    }
  }

  protected _navigateToSignIn() {
    this.router.navigate(['sign-in']);
  }

  private _resetForm() {
    this.form.reset();
  }
}

export class EmailValidator {
  static createValidator(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return authService.checkEmail(control.value).pipe(
        map(result => {
          if (result === 'true') {
            return { emailExists: true };
          } else {
            return { emailExists: null };
          }
        })
      );
    };
  }
}
