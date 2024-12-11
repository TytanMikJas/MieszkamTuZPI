import { useAuthStore } from '@/core/stores/auth-store';
import ForceResetPassword from './ForceResetPassword';

export default function ForceResetPasswordContainer() {
  const { me } = useAuthStore();
  return me && me.forceChangePassword && <ForceResetPassword />;
}
