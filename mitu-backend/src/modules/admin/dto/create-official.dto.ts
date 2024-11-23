import PublicUserDto from 'src/modules/user/dto/public-user-dto';

/**
 * DTO for creating an official
 * @property {PublicUserDto} user - the user to create
 * @property {string} password - the password for the user
 */
export default class CreateOfficialDto {
  user: PublicUserDto;
  password: string;
}
