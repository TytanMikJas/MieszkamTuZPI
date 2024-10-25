import { ROUTES } from '@/core/routing/Router';
import { DrawerTitle } from '@/shadcn/drawer';
import { Link } from 'react-router-dom';

interface DrawerOfficialMenuProps {
  setOpen: (open: boolean) => void;
}

export default function DrawerOfficialMenu({
  setOpen,
}: DrawerOfficialMenuProps) {
  return (
    <div className="flex flex-col space-y-2 pb-2">
      <DrawerTitle className="pt-4">Menu Urzędnika</DrawerTitle>
      <Link
        to={ROUTES.MAP.INVESTMENT_CREATE.path()}
        onClick={() => setOpen(false)}
      >
        Dodaj inwestycje
      </Link>
      <Link
        to={ROUTES.MAP.ANNOUNCEMENT_CREATE.path()}
        onClick={() => setOpen(false)}
      >
        Dodaj ogłoszenie
      </Link>
      <Link
        to={ROUTES.MAP.LISTING_CREATE.path()}
        onClick={() => setOpen(false)}
      >
        Dodaj nieruchomość
      </Link>
      <Link to={ROUTES.OFFICIAL.path()} onClick={() => setOpen(false)}>
        Zarządzaj komentarzami
      </Link>
      <Link
        to={ROUTES.OFFICIAL.NEWSLETTER.path()}
        onClick={() => setOpen(false)}
      >
        Panel newsletterów
      </Link>
    </div>
  );
}
