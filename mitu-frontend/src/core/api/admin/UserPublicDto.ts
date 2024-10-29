export default interface UserPublicDto {
  firstName: string;
  lastName: string;
  role: string;
  avatar: string;
}

export interface UserPublicExtendedDto extends UserPublicDto {
  id: string;
}
