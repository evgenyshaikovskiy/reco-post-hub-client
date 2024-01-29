export interface UserSignUpForm {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface UserSignUpDto extends UserSignUpForm {}
