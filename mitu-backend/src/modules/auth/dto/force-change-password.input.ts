import { IsString, IsStrongPassword } from 'class-validator';

/**
 * Data transfer object for changing forgotten password
 * @export
 * @class ChangeForgottenPasswordInputDto
 * @param {string} password
 */
export default class ForceChangePasswordInputDto {
  oldPassword: string;
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
