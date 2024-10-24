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
  debug?: boolean;
  debugName?: string;
};

type AuthGuardState = 'ALLOWED' | 'DENIED' | 'LOADING';
type Bypass = {
  field: string;
  value: string;
} | null;
export type AuthGuardRole = UserRole | 'ANONYMOUS';

// this function renders the children only if the user satisfies any of the authRules => otherwise it performs the onDeny action
function AuthGuard({
  renderAllowed,
  renderDenied,
  renderLoading,
  allowedRoles,
  onDeny,
  onAllow,
  bypass,
  debug,
  debugName,
}: Props) {
  const { me, fetchMe, loading, error } = useAuthStore();
  const initialState = calculateState(me, allowedRoles, bypass, loading);
  const [state, setState] = React.useState<AuthGuardState>(initialState);
  const [onAllowedPerformed, setOnAllowedPerformed] = React.useState(false);
  const [onDeniedPerformed, setOnDeniedPerformed] = React.useState(false);

  function calculateState(
    me: MeDto | any | undefined,
    allowedRoles: AuthGuardRole[],
    bypass: Bypass = null,
    loading: boolean | undefined,
  ) {
    const role = me?.role;

    const bypassAllowed =
      bypass && me && `${me[bypass.field]}` === `${bypass.value}`;

    if (bypassAllowed) {
      return 'ALLOWED';
    }

    if (loading || me === undefined) {
      return 'LOADING';
    }

    if (role) {
      if (allowedRoles.includes(role)) {
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

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (me === undefined) {
      return;
    }
    const newState = calculateState(me, allowedRoles, bypass, loading);
    setState(newState);
    if (newState === 'ALLOWED' && onAllow) {
      if (!onAllowedPerformed) {
        if (debug) {
          console.log(`Authguard ${debugName}, onAllow performed`);
        }
        onAllow();
        setOnAllowedPerformed(true);
      }
    } else if (newState === 'DENIED' && onDeny) {
      if (!onDeniedPerformed) {
        if (debug) {
          console.log(`Authguard ${debugName}, onDeny performed`);
        }
        onDeny();
        setOnDeniedPerformed(true);
      }
    }
  }, [me]);

  if (debug) {
    console.log(`Authguard ${debugName}, rendered with state: ${state}`);
  }

  return (
    <>
      {state === 'LOADING' && renderLoading}
      {state === 'ALLOWED' && renderAllowed}
      {state === 'DENIED' && renderDenied}
    </>
  );
}

export default AuthGuard;
