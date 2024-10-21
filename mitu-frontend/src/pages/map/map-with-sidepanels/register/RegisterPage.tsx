import AuthGuard from '@/core/auth/AuthGuard';
import { Role } from '@/core/auth/roles';
import { ROUTES } from '@/core/routing/Router';
import RegistrationForm from '@/reusable-components/registration-form/RegistrationForm';
import React from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {};

function RegisterPage({}: Props) {
  const navigate = useNavigate();

  return (
    <AuthGuard
      allowedRoles={[Role.ANONYMOUS]}
      onAllow={() => {}}
      onDeny={() => {
        navigate(ROUTES.MAP.LANDING_PAGE.path());
      }}
      renderAllowed={<RegistrationForm />}
      renderDenied={<div>Here there be login deny</div>}
    />
  );
}

export default RegisterPage;
