import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordShouldMatch(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password');
  const passwordConfirmation = control.get('passwordConfirmation');
  const errors = { passwordShouldMatch: { mismatch: true } };

  if (password?.value === passwordConfirmation?.value) {
    return null;
  }

  passwordConfirmation?.setErrors(errors);

  return errors;
}
