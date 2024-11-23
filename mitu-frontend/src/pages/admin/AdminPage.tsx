import Navbar from '@/reusable-components/navbar/Navbar';
import AdminStager from './AdminStager';
import UserList from './UserList';
import { Toaster } from 'sonner';
import AuthGuard from '@/core/auth/AuthGuard';
import { Role } from '@/core/auth/roles';
import { ROUTES } from '@/core/routing/Router';
import PanelLoader from '@/reusable-components/loaders/PanelLoader';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <AuthGuard
      allowedRoles={[Role.ADMIN]}
      onDeny={() => navigate(ROUTES.MAP.LOGIN.path())}
      renderAllowed={
        <>
          <Navbar />
          <Toaster />
          <div className="flex w-full h-[90vh]">
            <div className="flex flex-col w-full h-full">
              <UserList />
            </div>
            <div className="flex flex-col w-full h-full">
              <AdminStager />
            </div>
          </div>
        </>
      }
      renderLoading={<PanelLoader />}
    />
  );
}
