import { UserRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, IsEmail, IsEnum } from 'class-validator';
import { capitalizeFirstLetter } from 'src/utils/string-utils';

/**
 * Create official input dto
 * @export
 * @class CreateOfficialInputDto
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} email
 * @param {UserRole} role
 */
export default class CreateOfficialInputDto {
  @IsString()
  @MaxLength(20)
  @Transform(({ value }) => capitalizeFirstLetter(value))
  firstName: string;

  @IsString()
  @MaxLength(20)
  @Transform(({ value }) => capitalizeFirstLetter(value))
  lastName: string;

  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.toLocaleLowerCase())
  email: string;

  @IsEnum(UserRole)
  role: UserRole;
}
