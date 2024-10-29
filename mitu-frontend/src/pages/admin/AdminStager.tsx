import { useAdminStore } from '@/core/stores/admin-store';
import {
  ADMIN_NONE_STAGE,
  ADMIN_CREATE_STAGE,
  ADMIN_DETAILS_STAGE,
} from '@/strings';
import UserDetails from './UserDetails';
import UserCreate from './UserCreate';
import SidebarInfo from './SidebarInfo';

export default function AdminStager() {
  const { stage } = useAdminStore();

  switch (stage) {
    case ADMIN_NONE_STAGE:
      return <SidebarInfo />;
    case ADMIN_CREATE_STAGE:
      return <UserCreate />;
    case ADMIN_DETAILS_STAGE:
      return <UserDetails />;
    default:
      return <SidebarInfo />;
  }
}
