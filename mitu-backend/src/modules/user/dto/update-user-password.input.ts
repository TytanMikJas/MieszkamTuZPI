import { IsString, IsStrongPassword } from 'class-validator';

/**
 * Update user password input dto
 * @export
 * @class UpdateUserPasswordInputDto
 * @param {string} oldPassword
 * @param {string} newPassword
 */
export default class UpdateUserPasswordInputDto {
  @IsString()
  oldPassword: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword: string;
}
