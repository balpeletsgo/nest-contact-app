export class SignUpRequestDTO {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class SignInRequestDTO {
  email: string;
  password: string;
}

export class RefreshTokenRequestDTO {
  refresh_token: string;
}

export class LogoutRequestDTO {
  refresh_token: string;
}
