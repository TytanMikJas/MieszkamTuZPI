import { UserRole, UserStatus } from '@prisma/client';
import { PRISMA_ID } from 'src/types';

/**
 * User internal dto
 * @export
 * @class UserInternalDto
 * @param {PRISMA_ID} id
 * @param {string} password
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} email
 * @param {string} avatar
 * @param {boolean} newsletter_agreement
 * @param {UserRole} role
 * @param {UserStatus} status
 * @param {boolean} forceChangePassword
 */
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
