import { PRISMA_ID } from '../../../types';
import { UserRole } from './user-role';
import { UserStatus } from './user-status';

export default interface MeDto {
  id?: PRISMA_ID;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  newsletter_agreement: boolean;
  role: UserRole;
  status: UserStatus;
  forceChangePassword: boolean;
}
