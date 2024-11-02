import UserInternalDto from 'src/modules/user/dto/user.internal';

/**
 * Me dto
 * @export
 * @type MeDto
 */
export type MeDto = Omit<UserInternalDto, 'password'>;
