import { IsString } from 'class-validator';

/**
 * Delete account input dto
 * @export
 * @class DeleteAccountInputDto
 * @param {string} password
 */
export default class DeleteAccountInputDto {
  @IsString()
  password: string;
}
