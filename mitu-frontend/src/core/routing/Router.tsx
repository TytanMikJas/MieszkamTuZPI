import { Navigate, createBrowserRouter } from 'react-router-dom';
import { Role } from '../api/auth/roles';
import GlobalLayout from '@/pages/GlobalLayout';
import MapWithPostsLayout from '@/pages/map/MapWithPostsLayout';
import MapWithSidepanelsLayout from '@/pages/map/map-with-sidepanels/MapWithSidepanelsLayout';
import NamedRoute from './named-outlet/NamedRoute';
import AnnouncementDetails from '@/reusable-components/post-details/announcement-details/AnnouncementDetails';
import AnnouncementsPage from '@/pages/map/map-with-sidepanels/announcements/AnnouncementsPage';
import AnnouncementCreatePage from '@/pages/map/map-with-sidepanels/announcement/AnnouncementCreatePage';
import AnnouncementEditPage from '@/pages/map/map-with-sidepanels/announcement/AnnouncementEditPage';
import LoginPage from '@/pages/map/map-with-sidepanels/login/LoginPage';
import RegisterPage from '@/pages/map/map-with-sidepanels/register/RegisterPage';
import InvestmentCreatePage from '@/pages/map/map-with-sidepanels/investment/InvestmentCreatePage';
import InvestmentEditPage from '@/pages/map/map-with-sidepanels/investment/InvestmentEditPage';
import InvestmentsPage from '@/pages/map/map-with-sidepanels/investments/InvestmentsPage';
import InvestmentDetails from '@/reusable-components/post-details/investment-details/InvestmentDetails';

export const MAP = 'mapa';
export const LANDING_PAGE = 'start';
export const LOGIN = 'login';
export const REGISTER = 'rejestracja';

export const INVESTMENT = 'inwestycja';
export const INVESTMENTS = 'inwestycje';
export const INVESTMENT_CREATE = 'kreator-inwestycji';
export const INVESTMENT_EDIT = 'edycja-inwestycji';

export const ANNOUNCEMENT = 'ogloszenie';
export const ANNOUNCEMENTS = 'ogloszenia';
export const ANNOUNCEMENT_CREATE = 'kreator-ogloszenia';
export const ANNOUNCEMENT_EDIT = 'edycja-ogloszenia';

export const LISTING = 'nieruchomosc';
export const LISTINGS = 'nieruchomosci';
export const LISTING_CREATE = 'kreator-nieruchomosci';
export const LISTING_EDIT = 'edycja-nieruchomosci';

export const BAF_CALCULATOR = 'kalkulator-baf';
export const BAF_CALCULATOR_SIMPLE = 'kalkulator-baf-prosty';
export const BAF_CALCULATOR_GRAPHIC = 'kalkulator-baf-graficzny';

export const BY_NAME = ':nazwa';
export const ADD = 'dodaj';
export const SALE_RENT = 'sprzedaz-wynajem';
export const OFFICIAL = 'urzednik';
export const ADMIN = 'admin';
export const DASHBOARD = 'dashboard';
export const SETTINGS = 'settings';
export const NEWSLETTER = 'newsletter';
export const FORGOT_PASSWORD = 'zapomnialem-hasla';

export const ROUTES = {
  MAP: {
    FORGOT_PASSWORD: {
      path: () => `${MAP}/${FORGOT_PASSWORD}`,
    },
    path: () => `/${MAP}`,
    allowed: [Role.ANONYMOUS, Role.USER, Role.ADMIN, Role.OFFICIAL],
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
    INVESTMENT: {
      path: () => `/${MAP}/${INVESTMENT}`,
      BY_NAME: {
        path: (slug: string) => `/${MAP}/${INVESTMENT}/${slug}`,
        allowed: [Role.ANONYMOUS, Role.USER, Role.ADMIN, Role.OFFICIAL],
      },
    },
    INVESTMENTS: {
      path: () => `/${MAP}/${INVESTMENTS}`,
      allowed: [Role.ANONYMOUS, Role.USER, Role.ADMIN, Role.OFFICIAL],
    },
    INVESTMENT_CREATE: {
      path: () => `/${MAP}/${INVESTMENT_CREATE}`,
      allowed: [Role.OFFICIAL],
    },
    INVESTMENT_EDIT: {
      path: () => `/${MAP}/${INVESTMENT_EDIT}`,
      BY_NAME: {
        path: (slug: string) => `/${MAP}/${INVESTMENT_EDIT}/${slug}`,
        allowed: [Role.OFFICIAL],
      },
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
    LISTING: {
      path: () => `/${MAP}/${LISTING}`,
      BY_NAME: {
        path: (slug: string) => `/${MAP}/${LISTING}/${slug}`,
        allowed: [Role.ANONYMOUS, Role.USER, Role.ADMIN, Role.OFFICIAL],
      },
    },
    LISTINGS: {
      path: () => `/${MAP}/${LISTINGS}`,
      allowed: [Role.ANONYMOUS, Role.USER, Role.ADMIN, Role.OFFICIAL],
    },
    LISTING_CREATE: {
      path: () => `/${MAP}/${LISTING_CREATE}`,
      allowed: [Role.OFFICIAL],
    },
    LISTING_EDIT: {
      path: () => `/${MAP}/${LISTING_EDIT}`,
      BY_NAME: {
        path: (slug: string) => `/${MAP}/${LISTING_EDIT}/${slug}`,
        allowed: [Role.OFFICIAL],
      },
    },
  },
  OFFICIAL: {
    path: () => `/${OFFICIAL}`,
    allowed: [Role.OFFICIAL],
    NEWSLETTER: {
      path: () => `/${OFFICIAL}/${NEWSLETTER}`,
      allowed: [Role.OFFICIAL],
    },
  },
  BAF_CALCULATOR: {
    path: () => `/${BAF_CALCULATOR}`,
    allowed: [Role.ANONYMOUS, Role.USER, Role.ADMIN, Role.OFFICIAL],
  },
  BAF_CALCULATOR_SIMPLE: {
    path: () => `/${BAF_CALCULATOR_SIMPLE}`,
    allowed: [Role.ANONYMOUS, Role.USER, Role.ADMIN, Role.OFFICIAL],
  },
  BAF_CALCULATOR_GRAPHIC: {
    path: () => `/${BAF_CALCULATOR_GRAPHIC}`,
    allowed: [Role.ANONYMOUS, Role.USER, Role.ADMIN, Role.OFFICIAL],
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
                path: ROUTES.MAP.FORGOT_PASSWORD.path(),
                element: (
                  <NamedRoute
                    outlets={[{ name: 'left', content: <div>FORGOT</div> }]}
                  />
                ),
              },
              {
                path: ROUTES.MAP.LANDING_PAGE.path(),
                element: (
                  <NamedRoute
                    outlets={[{ name: 'left', content: <div>LANDING</div> }]}
                  />
                ),
              },
              {
                path: ROUTES.MAP.LOGIN.path(),
                element: (
                  <NamedRoute
                    outlets={[{ name: 'left', content: <LoginPage /> }]}
                  />
                ),
              },
              {
                path: ROUTES.MAP.REGISTER.path(),
                element: (
                  <NamedRoute
                    outlets={[{ name: 'left', content: <RegisterPage /> }]}
                  />
                ),
              },
              {
                path: ROUTES.MAP.INVESTMENT.BY_NAME.path(':name'),
                element: (
                  <NamedRoute
                    outlets={[
                      {
                        name: 'left',
                        content: <InvestmentDetails />,
                      },
                    ]}
                  />
                ),
              },
              {
                path: ROUTES.MAP.INVESTMENTS.path(),
                element: (
                  <NamedRoute
                    outlets={[{ name: 'left', content: <InvestmentsPage /> }]}
                  />
                ),
              },
              {
                path: ROUTES.MAP.INVESTMENT_CREATE.path(),
                element: (
                  <NamedRoute
                    outlets={[
                      { name: 'left', content: <InvestmentCreatePage /> },
                    ]}
                  />
                ),
              },
              {
                path: ROUTES.MAP.INVESTMENT_EDIT.BY_NAME.path(':name'),
                element: (
                  <NamedRoute
                    outlets={[
                      { name: 'left', content: <InvestmentEditPage /> },
                    ]}
                  />
                ),
              },
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
          },
        ],
      },
    ],
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
