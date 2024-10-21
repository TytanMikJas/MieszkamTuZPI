import React, { useEffect } from 'react';
import { Role } from './roles';
import { useAuthStore } from '../stores/auth-store';
import { UserRole } from '../api/auth/dto/user-role';
import { all } from 'axios';
import MeDto from '../api/auth/dto/me';

type Props = {
  renderAllowed?: React.ReactNode;
  renderDenied?: React.ReactNode;
  renderLoading?: React.ReactNode;
  allowedRoles: AuthGuardRole[];
  onDeny?: () => void;
  onAllow?: () => void;
  bypass?: Bypass;
};

type AuthGuardState = 'ALLOWED' | 'DENIED' | 'LOADING';
type Bypass = {
  field: string;
  value: string;
} | null;
export type AuthGuardRole = UserRole | 'ANONYMOUS';

function calculateState(
  me: MeDto | any,
  allowedRoles: AuthGuardRole[],
  bypass: Bypass = null,
) {
  const role = me?.role;

  const bypassAllowed =
    bypass && me && `${me[bypass.field]}` === `${bypass.value}`;

  if (role) {
    if (allowedRoles.includes(role) || bypassAllowed) {
      return 'ALLOWED';
    } else {
      return 'DENIED';
    }
  } else {
    if (allowedRoles.includes('ANONYMOUS')) {
      return 'ALLOWED';
    } else {
      return 'DENIED';
    }
  }
}

// this function renders the children only if the user satisfies any of the authRules => otherwise it performs the onDeny action
function AuthGuard({
  renderAllowed,
  renderDenied,
  renderLoading,
  allowedRoles,
  onDeny,
  onAllow,
  bypass,
}: Props) {
  const { me, fetchMe, loading, error } = useAuthStore();
  const initialState = calculateState(me, allowedRoles, bypass);
  const [state, setState] = React.useState<AuthGuardState>(initialState);

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    const newState = calculateState(me, allowedRoles, bypass);
    setState(newState);
    if (newState === 'ALLOWED' && onAllow) {
      onAllow();
    } else if (newState === 'DENIED' && onDeny) {
      onDeny();
    }
  }, [me]);

  return (
    <>
      {state === 'LOADING' && renderLoading}
      {state === 'ALLOWED' && renderAllowed}
      {state === 'DENIED' && renderDenied}
    </>
  );
}

export default AuthGuard;
