import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/shadcn/dropdown-menu';
import { Button } from '@/shadcn/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/avatar';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/routing/Router';

export function AnonymousAvatar() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-11 w-11">
            <AvatarImage alt="@shadcn" />
            <AvatarFallback>@</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 z-[500]" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium leading-none">Gość</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <Link to={ROUTES.MAP.LOGIN.path()}>
          <DropdownMenuItem className="cursor-pointer">
            Zaloguj się
          </DropdownMenuItem>
        </Link>
        <Link to={ROUTES.MAP.REGISTER.path()}>
          <DropdownMenuItem className="cursor-pointer">
            Zarejestruj się
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
