import { Link, NavLink, useLocation } from 'react-router-dom';
import { UserAvatar } from './UserAvatar';
import { ROUTES } from '../../core/routing/Router';
import { Search, Menu } from 'lucide-react';
import AuthGuard from '@/core/auth/AuthGuard';
import { DropdownOfficialMenu } from './DropdownOfficialMenu';
import { useMediaQuery } from 'react-responsive';
import { useState, useRef, useEffect } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shadcn/drawer';
import { Button } from '@/shadcn/button';
import { AnonymousAvatar } from './AnonymousAvatar';
import DrawerOfficialMenu from './DrawerOfficialMenu';
import { useAuthStore } from '@/core/stores/auth-store';
import DrawerAdminMenu from './DrawerAdminMenu';
import { DropdownAdminMenu } from './DropdownAdminMenu';

export default function Navbar() {
  const { me } = useAuthStore();
  const location = useLocation();

  const menus = [
    {
      title: 'Inwestycje',
      path: ROUTES.MAP.INVESTMENTS.path(),
      subpath: ROUTES.MAP.INVESTMENT.path(),
    },
    {
      title: 'Ogłoszenia',
      path: ROUTES.MAP.ANNOUNCEMENTS.path(),
      subpath: ROUTES.MAP.ANNOUNCEMENT.path(),
    },
    {
      title: 'Nieruchomości',
      path: ROUTES.MAP.LISTINGS.path(),
      subpath: ROUTES.MAP.LISTING.path(),
    },
    {
      title: 'Kalkulator BAF',
      path: ROUTES.BAF_CALCULATOR.path(),
      subpath: ROUTES.BAF_CALCULATOR_SIMPLE.path(),
    },
  ];

  const isTablet = useMediaQuery({ query: '(max-width: 1375px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 875px)' });
  const [open, setOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (isMobile) {
    return (
      <nav className="h-[7vh] border-b-4 relative">
        <div className="flex justify-between items-center h-full px-3">
          <div>
            <Link
              to={ROUTES.MAP.LANDING_PAGE.path()}
              className="flex items-center"
            >
              <img src="/mitu.png" className="w-9 mr-3" alt="" />
              <h1 className="text-xl py-3 font-bold">MieszkamTu</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size={'icon'} className="w-7">
                  <Menu />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="z-[400000000000000]">
                <DrawerHeader className="text-left">
                  <DrawerTitle>Menu</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col px-4 space-y-2">
                  {menus.map((item, idx) => (
                    <NavLink
                      key={idx}
                      to={item.path}
                      end={true}
                      className={({ isActive }) =>
                        `hover:text-red-500 ${isActive || location.pathname.includes(item.path) || location.pathname.includes(item.subpath) ? 'text-red-500 font-bold' : ''}`
                      }
                      onClick={() => setOpen(false)}
                    >
                      {item.title}
                    </NavLink>
                  ))}
                  <AuthGuard
                    allowedRoles={['OFFICIAL']}
                    renderAllowed={<DrawerOfficialMenu setOpen={setOpen} />}
                  />
                  <AuthGuard
                    allowedRoles={['ADMIN']}
                    renderAllowed={<DrawerAdminMenu setOpen={setOpen} />}
                  />
                </div>
                <DrawerFooter className="pt-2">
                  <DrawerClose asChild>
                    <Button variant="outline">Zamknij</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <div className="flex items-center">
              {me ? (
                <UserAvatar
                  avatar={me.avatar || ''}
                  name={me.firstName}
                  surname={me.lastName}
                  email={me.email}
                />
              ) : (
                <AnonymousAvatar />
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="h-[7vh] border-b-4 relative">
        <div className="flex justify-between items-center h-full px-4">
          <div>
            <Link
              to={ROUTES.MAP.LANDING_PAGE.path()}
              className="flex items-center"
            >
              <img src="/mitu.png" className="w-11 mr-3" alt="" />
              <h1 className="text-xl py-3 font-bold">
                {isTablet ? 'MieszkamTu' : 'MieszkamTu'}
                <sub className="ml-1 text-xs">
                  <i>{import.meta.env.VITE_CITY_NAME}</i>
                </sub>
              </h1>
            </Link>
          </div>
          <div className="w-min absolute left-1/2 transform -translate-x-1/2 flex justify-center space-x-5">
            {menus.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) =>
                  `hover:text-red-500 text-nowrap ${isActive || location.pathname.includes(item.path) || location.pathname.includes(item.subpath) ? 'text-red-500 font-bold' : ''}`
                }
              >
                {item.title}
              </NavLink>
            ))}
            <AuthGuard
              allowedRoles={['OFFICIAL']}
              renderAllowed={<DropdownOfficialMenu />}
            />
            <AuthGuard
              allowedRoles={['ADMIN']}
              renderAllowed={<DropdownAdminMenu />}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center z-1000">
              {me ? (
                <UserAvatar
                  avatar={me.avatar || ''}
                  name={me.firstName}
                  surname={me.lastName}
                  email={me.email}
                />
              ) : (
                <AnonymousAvatar />
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
