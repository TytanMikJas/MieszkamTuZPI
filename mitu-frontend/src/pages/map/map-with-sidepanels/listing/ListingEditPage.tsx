import AuthGuard from '../../../../core/auth/AuthGuard';
import { Role } from '../../../../core/auth/roles';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../core/routing/Router';
import PanelLoader from '@/reusable-components/loaders/PanelLoader';
import CreateListingForm from '@/reusable-components/forms/CreateListingForm';

export default function ListingEditPage() {
  const navigate = useNavigate();

  return (
    <AuthGuard
      allowedRoles={[Role.OFFICIAL]}
      onDeny={() => navigate(ROUTES.MAP.LOGIN.path())}
      renderAllowed={<CreateListingForm edit />}
      renderLoading={<PanelLoader />}
    />
  );
}
