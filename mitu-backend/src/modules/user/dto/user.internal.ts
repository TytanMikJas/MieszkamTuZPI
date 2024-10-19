import { UserRole, UserStatus } from '@prisma/client';
import { PRISMA_ID } from 'src/types';

export default class UserInternalDto {
  id?: PRISMA_ID;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  newsletter_agreement: boolean;
  role: UserRole;
  status: UserStatus;
  forceChangePassword: boolean;
}
