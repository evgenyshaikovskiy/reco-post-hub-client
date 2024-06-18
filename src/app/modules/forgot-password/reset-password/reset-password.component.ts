import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PASSWORD_REGEX } from '../../../core/consts/regex';
import { passwordShouldMatch } from '../../../core/validators/password-should-match';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  public form = this.fb.nonNullable.group({
    password: this.fb.nonNullable.group(
      {
        password: [
          '',
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(35),
          Validators.pattern(PASSWORD_REGEX),
        ],
        passwordConfirmation: '',
      },
      { validators: passwordShouldMatch }
    ),
  });

  constructor(private readonly fb: FormBuilder) {}
}
