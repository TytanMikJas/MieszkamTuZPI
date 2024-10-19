import UserInternalDto from 'src/modules/user/dto/user.internal';

export type MeDto = Omit<UserInternalDto, 'password'>;
