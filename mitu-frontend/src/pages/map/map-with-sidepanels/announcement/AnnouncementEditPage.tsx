import AuthGuard from '../../../../core/auth/AuthGuard';
import { Role } from '../../../../core/auth/roles';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../core/routing/Router';
import PanelLoader from '@/reusable-components/loaders/PanelLoader';
import CreateAnnouncementForm from '@/reusable-components/forms/CreateAnnouncementForm';

export default function AnnouncementEditPage() {
  const navigate = useNavigate();

  return (
    <AuthGuard
      allowedRoles={[Role.OFFICIAL]}
      onDeny={() => navigate(ROUTES.MAP.LOGIN.path())}
      renderAllowed={<CreateAnnouncementForm edit />}
      renderLoading={<PanelLoader />}
    />
  );
}
