import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../../../strings';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
