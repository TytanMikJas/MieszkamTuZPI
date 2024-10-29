import UserPublicDto from './UserPublicDto';

export default interface CreateOfficialDto {
  user: UserPublicDto;
  password: string;
}
