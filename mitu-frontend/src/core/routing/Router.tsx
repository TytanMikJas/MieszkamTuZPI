import { Navigate, createBrowserRouter } from 'react-router-dom';
import { Role } from '../api/auth/roles';
import GlobalLayout from '@/pages/GlobalLayout';

export const MAP = 'mapa';
export const LANDING_PAGE = 'start';
export const LOGIN = 'login';
export const REGISTER = 'rejestracja';

export const ADMIN = 'admin';

export const ROUTES = {
  MAP: {
    LANDING_PAGE: {
      path: () => `/${MAP}/${LANDING_PAGE}`,
      allowed: [Role.ANONYMOUS, Role.USER, Role.ADMIN, Role.OFFICIAL],
    },
    LOGIN: {
      path: () => `/${MAP}/${LOGIN}`,
      allowed: [Role.ANONYMOUS],
    },
    REGISTER: {
      path: () => `/${MAP}/${REGISTER}`,
      allowed: [Role.ANONYMOUS],
    },
  },
  ADMIN: {
    path: () => `/${ADMIN}`,
    allowed: [Role.ADMIN],
  },
} as const;

export const router = createBrowserRouter([
  {
    element: <GlobalLayout />,
    children: [],
  },
  {
    path: ROUTES.MAP.LANDING_PAGE.path(),
    element: <div>landing</div>,
  },
  {
    path: ROUTES.ADMIN.path(),
    element: <div>admin</div>,
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.MAP.LANDING_PAGE.path()} />,
  },
]);
