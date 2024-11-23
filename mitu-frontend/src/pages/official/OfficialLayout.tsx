import AuthGuard from '@/core/auth/AuthGuard';
import { Role } from '@/core/auth/roles';
import { ROUTES } from '@/core/routing/Router';
import { Outlet, useNavigate } from 'react-router-dom';

type Props = {};

function OfficialLayout({}: Props) {
  const navigate = useNavigate();
  return (
    <AuthGuard
      allowedRoles={[Role.OFFICIAL]}
      onDeny={() => {
        navigate(ROUTES.MAP.LANDING_PAGE.path());
      }}
      renderAllowed={<Outlet />}
    />
  );
}

export default OfficialLayout;
