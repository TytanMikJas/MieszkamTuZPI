import { Transform } from 'class-transformer';
import { IsBoolean, MaxLength } from 'class-validator';
import { capitalizeFirstLetter } from 'src/utils/string-utils';

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
