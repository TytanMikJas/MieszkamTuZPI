import { Transform } from 'class-transformer';
import { IsBoolean, MaxLength } from 'class-validator';
import { capitalizeFirstLetter } from 'src/utils/string-utils';

/**
 * Update user info input dto
 * @export
 * @class UpdateUserInfoInputDto
 * @param {string} firstName
 * @param {string} lastName
 * @param {boolean} newsletter_agreement
 */
export default class UpdateUserInfoInputDto {
  @MaxLength(20)
  @Transform(({ value }) => capitalizeFirstLetter(value))
  firstName: string;

  @MaxLength(20)
  @Transform(({ value }) => capitalizeFirstLetter(value))
  lastName: string;

  @IsBoolean()
  newsletter_agreement: boolean;
}
