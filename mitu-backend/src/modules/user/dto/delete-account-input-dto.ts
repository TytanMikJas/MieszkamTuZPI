import { IsString } from 'class-validator';

export default class DeleteAccountInputDto {
  @IsString()
  password: string;
}
