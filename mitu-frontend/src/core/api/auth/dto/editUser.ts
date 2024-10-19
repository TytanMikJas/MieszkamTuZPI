export interface UpdateUserEmailInputDto {
  password: string;
  email: string;
}

export interface UpdateUserInfoInputDto {
  firstName: string;
  lastName: string;
  newsletter_agreement?: boolean;
}

export interface UpdateUserPasswordInputDto {
  oldPassword: string;
  newPassword: string;
}

export interface DeleteAccountInputDto {
  password: string;
}
