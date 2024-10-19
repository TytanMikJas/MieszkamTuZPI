import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { capitalizeFirstLetter } from 'src/utils/string-utils';

export default class CreateUserInputDto {
  @MaxLength(20)
  @Transform(({ value }) => capitalizeFirstLetter(value))
  firstName: string;

  @MaxLength(20)
  @Transform(({ value }) => capitalizeFirstLetter(value))
  lastName: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @IsEmail()
  @Transform(({ value }) => value.toLocaleLowerCase())
  email: string;

  @IsBoolean()
  newsletter_agreement: boolean;

  @Optional()
  forceChangePassword: boolean;

  //avatar?: string;
}
