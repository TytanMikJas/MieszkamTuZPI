export interface SignInDto {
  email: string;
  password: string;
}

export interface SignInOutputDto {
  accessToken: string;
  refreshToken: string;
}
