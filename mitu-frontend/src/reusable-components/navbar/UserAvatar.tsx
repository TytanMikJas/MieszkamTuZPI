import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../../shadcn/dropdown-menu';
import { useAuthStore } from '@/core/stores/auth-store';
import EditProfile from '../edit-profile/EditProfile';
import Avatar from '../misc/avatar/Avatar';
import { ROUTES } from '@/core/routing/Router';
import { Link } from 'react-router-dom';

type Props = {
  avatar: string;
  name: string;
  surname: string;
  email: string;
};

export function UserAvatar({ avatar, name, surname, email }: Props) {
  const { logOut } = useAuthStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar src={avatar} alt={email} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 z-[2000]" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {name + ' ' + surname}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <EditProfile />
        <DropdownMenuItem>
          <Link
            to={ROUTES.MAP.LANDING_PAGE.path()}
            onClick={logOut}
            className="text-red-700 cursor-pointer flex items-center w-full"
          >
            Wyloguj
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
