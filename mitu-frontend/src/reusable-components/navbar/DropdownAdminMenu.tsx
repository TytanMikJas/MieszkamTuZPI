import { ROUTES } from '@/core/routing/Router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shadcn/dropdown-menu';
import { NavLink } from 'react-router-dom';

export function DropdownAdminMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <p className="hover:text-red-500 cursor-pointer text-nowrap">
          Menu Administratora
        </p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-[500]">
        <NavLink
          to={ROUTES.ADMIN.path()}
          className={({ isActive }) =>
            `text-nowrap ${isActive ? 'text-red-500 font-bold' : ''}`
          }
        >
          <DropdownMenuItem className="cursor-pointer">
            Zarządzaj użytkownikami
          </DropdownMenuItem>
        </NavLink>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
