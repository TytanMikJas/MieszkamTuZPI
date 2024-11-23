import { UserRole } from '@prisma/client';
import { Transform } from 'class-transformer';

/**
 * Transformer, which transforms a string of comma separated string of user roles into an array of user roles.
 * @returns
 */
export default function UserRolesTransform() {
  return Transform(({ value }) => {
    return value.split(',').map((role) => role as UserRole);
  });
}
