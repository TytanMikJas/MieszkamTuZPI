import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export default class UpdateUserEmailInputDto {
  @IsString()
  password: string;

  @IsEmail()
  @Transform(({ value }) => value.toLocaleLowerCase())
  email: string;
}
