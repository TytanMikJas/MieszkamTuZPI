import { ROUTES } from '@/core/routing/Router';
import { DrawerTitle } from '@/shadcn/drawer';
import { Link } from 'react-router-dom';

interface DrawerAdminMenuProps {
  setOpen: (open: boolean) => void;
}

export default function DrawerAdminMenu({ setOpen }: DrawerAdminMenuProps) {
  return (
    <div className="flex flex-col space-y-2 pb-2">
      <DrawerTitle className="pt-4">Menu Administratora</DrawerTitle>
      <Link to={ROUTES.ADMIN.path()} onClick={() => setOpen(false)}>
        Zarządzaj użytkownikami
      </Link>
    </div>
  );
}
