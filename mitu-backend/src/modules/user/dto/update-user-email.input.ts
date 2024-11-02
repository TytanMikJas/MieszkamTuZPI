import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

/**
 * Update user email input dto
 * @export
 * @class UpdateUserEmailInputDto
 * @param {string} password
 * @param {string} email
 */
export default class UpdateUserEmailInputDto {
  @IsString()
  password: string;

  @IsEmail()
  @Transform(({ value }) => value.toLocaleLowerCase())
  email: string;
}
