import { Navigate, createBrowserRouter } from 'react-router-dom';
import { Role } from '../api/auth/roles';
import GlobalLayout from '@/pages/GlobalLayout';
import MapWithPostsLayout from '@/pages/map/MapWithPostsLayout';
import MapWithSidepanelsLayout from '@/pages/map/map-with-sidepanels/MapWithSidepanelsLayout';
import NamedRoute from './named-outlet/NamedRoute';
import AnnouncementDetails from '@/reusable-components/post-details/announcement-details/AnnouncementDetails';
import { ANNOUNCEMENT_NAME } from '@/strings';

export const MAP = 'mapa';
export const LANDING_PAGE = 'start';
export const LOGIN = 'login';
export const REGISTER = 'rejestracja';

export const ANNOUNCEMENT = 'ogloszenie';
export const ANNOUNCEMENTS = 'ogloszenia';
export const ANNOUNCEMENT_CREATE = 'kreator-ogloszenia';
export const ANNOUNCEMENT_EDIT = 'edycja-ogloszenia';

export const ADMIN = 'admin';

export const ROUTES = {
  MAP: {
    LANDING_PAGE: {
      path: () => `/${MAP}/${LANDING_PAGE}`,
      allowed: [Role.ANONYMOUS, Role.USER, Role.ADMIN, Role.OFFICIAL],
    },
    ANNOUNCEMENT: {
      path: () => `/${MAP}/${ANNOUNCEMENT}`,
      BY_NAME: {
        path: (slug: string) => `/${MAP}/${ANNOUNCEMENT}/${slug}`,
        allowed: [Role.ANONYMOUS, Role.USER, Role.ADMIN, Role.OFFICIAL],
      },
    },
    ANNOUNCEMENTS: {
      path: () => `/${MAP}/${ANNOUNCEMENTS}`,
      allowed: [Role.ANONYMOUS, Role.USER, Role.ADMIN, Role.OFFICIAL],
    },
    ANNOUNCEMENT_CREATE: {
      path: () => `/${MAP}/${ANNOUNCEMENT_CREATE}`,
      allowed: [Role.OFFICIAL],
    },
    ANNOUNCEMENT_EDIT: {
      path: () => `/${MAP}/${ANNOUNCEMENT_EDIT}`,
      BY_NAME: {
        path: (slug: string) => `/${MAP}/${ANNOUNCEMENT_EDIT}/${slug}`,
        allowed: [Role.OFFICIAL],
      },
    },
  },
  LOGIN: {
    path: () => `/${MAP}/${LOGIN}`,
    allowed: [Role.ANONYMOUS],
  },
  REGISTER: {
    path: () => `/${MAP}/${REGISTER}`,
    allowed: [Role.ANONYMOUS],
  },
  ADMIN: {
    path: () => `/${ADMIN}`,
    allowed: [Role.ADMIN],
  },
} as const;

export const router = createBrowserRouter([
  {
    element: <GlobalLayout />,
    children: [
      {
        element: <MapWithPostsLayout />,
        children: [
          {
            element: <MapWithSidepanelsLayout />,
            children: [
              {
                path: ROUTES.MAP.ANNOUNCEMENT.BY_NAME.path(':name'),
                element: (
                  <NamedRoute
                    outlets={[
                      {
                        name: 'left',
                        content: <AnnouncementDetails />,
                      },
                      {
                        name: 'right',
                        content: <div>tu beda komentarze</div>,
                      },
                    ]}
                  />
                ),
              },
              {
                path: ROUTES.MAP.ANNOUNCEMENTS.path(),
                element: (
                  <NamedRoute
                    outlets={[
                      {
                        name: 'left',
                        content: <AnnouncementsPage />,
                      },
                    ]}
                  />
                ),
              },
              {
                path: ROUTES.MAP.ANNOUNCEMENT_CREATE.path(),
                element: (
                  <NamedRoute
                    outlets={[
                      { name: 'left', content: <AnnouncementCreatePage /> },
                    ]}
                  />
                ),
              },
              {
                path: ROUTES.MAP.ANNOUNCEMENT_EDIT.BY_NAME.path(':name'),
                element: (
                  <NamedRoute
                    outlets={[
                      {
                        name: 'left',
                        content: <AnnouncementEditPage />,
                      },
                    ]}
                  />
                ),
              },
            ],
          }],
      }
    ],
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
