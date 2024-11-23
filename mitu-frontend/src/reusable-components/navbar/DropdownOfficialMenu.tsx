import { ROUTES } from '@/core/routing/Router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn/dropdown-menu';
import { NavLink, Link } from 'react-router-dom';

export function DropdownOfficialMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <p className="hover:text-blue-500 cursor-pointer text-nowrap">
          Menu Urzędnika
        </p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-[500]">
        <DropdownMenuLabel>Dodaj</DropdownMenuLabel>
        <NavLink
          to={ROUTES.MAP.INVESTMENT_CREATE.path()}
          className={({ isActive }) =>
            `text-nowrap ${isActive ? 'text-blue-500 font-bold' : ''}`
          }
        >
          <DropdownMenuItem className="cursor-pointer">
            Inwestycje
          </DropdownMenuItem>
        </NavLink>
        <NavLink
          to={ROUTES.MAP.ANNOUNCEMENT_CREATE.path()}
          className={({ isActive }) =>
            `text-nowrap ${isActive ? 'text-blue-500 font-bold' : ''}`
          }
        >
          <DropdownMenuItem className="cursor-pointer">
            Ogłoszenie
          </DropdownMenuItem>
        </NavLink>
        <NavLink
          to={ROUTES.MAP.LISTING_CREATE.path()}
          className={({ isActive }) =>
            `text-nowrap ${isActive ? 'text-blue-500 font-bold' : ''}`
          }
        >
          <DropdownMenuItem className="cursor-pointer">
            Nieruchomość
          </DropdownMenuItem>
        </NavLink>
        <NavLink
          to={ROUTES.OFFICIAL.path()}
          className={({ isActive }) =>
            `text-nowrap ${isActive ? 'text-blue-500 font-bold' : ''}`
          }
        >
          <DropdownMenuItem className="cursor-pointer">
            Zarządzaj komentarzami
          </DropdownMenuItem>
        </NavLink>
        <DropdownMenuSeparator />
        <Link to={ROUTES.OFFICIAL.NEWSLETTER.path()}>
          <DropdownMenuItem className="cursor-pointer">
            Panel newsletterów
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
