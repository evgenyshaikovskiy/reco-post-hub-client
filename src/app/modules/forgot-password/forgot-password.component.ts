import { Component } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  public form = this.fb.nonNullable.group({
    email: [
      '',
      [Validators.required, Validators.email],
      [EmailValidator.createValidator(this.authService)],
    ],
  });

  public get isDisabled(): boolean {
    const ctrRef = this.form.controls.email;
    return (
      ctrRef.dirty &&
      (ctrRef.hasError('required') ||
        ctrRef.hasError('email') ||
        ctrRef.hasError('emailNotExist'))
    );
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService
  ) {}
}

export class EmailValidator {
  static createValidator(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return authService.checkEmail(control.value).pipe(
        tap(result => console.log(result)),
        map(result => {
          if (result === 'false') {
            return { emailNotExist: true };
          } else {
            return { emailNotExist: null };
          }
        })
      );
    };
  }
}
