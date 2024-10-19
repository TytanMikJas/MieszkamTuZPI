import { useAuthStore } from '@/core/stores/auth-store';
import LoginDialog from './LoginDialog';
import { useState } from 'react';

export default function ExpectLoggedIn({
  children,
}: {
  children: React.ReactNode;
}) {
  const { me } = useAuthStore();
  const [visible, setVisible] = useState(false);
  const handleSetVisible = () => setVisible(true);
  return me ? (
    children
  ) : (
    <div>
      <div onClick={handleSetVisible}>
        <div
          className="flex justify-center items-center"
          style={{ pointerEvents: 'none' }}
        >
          {children}
        </div>
      </div>
      <LoginDialog open={visible} setOpen={setVisible} />
    </div>
  );
}
