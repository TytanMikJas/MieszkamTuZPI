import AuthGuard from '../../../../core/auth/AuthGuard';
import { Role } from '../../../../core/auth/roles';
import LoginForm from '../../../../reusable-components/login-form/LoginForm';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../core/routing/Router';

type Props = {};

function LoginPage({}: Props) {
  const navigate = useNavigate();

  return (
    <AuthGuard
      allowedRoles={[Role.ANONYMOUS]}
      onAllow={() => {}}
      onDeny={() => {
        navigate(ROUTES.MAP.LANDING_PAGE.path());
      }}
      renderAllowed={<LoginForm />}
      renderDenied={<div>Here there be login deny</div>}
    />
  );
}

export default LoginPage;
