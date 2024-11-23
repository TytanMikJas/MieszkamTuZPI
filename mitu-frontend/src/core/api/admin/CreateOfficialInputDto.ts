import { UserRole } from '../auth/dto/user-role';

export default interface CreateOfficialInputDto {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
