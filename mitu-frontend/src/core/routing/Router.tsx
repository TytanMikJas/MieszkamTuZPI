import { Navigate, createBrowserRouter } from 'react-router-dom';
import { Role } from '../auth/roles';
import GlobalLayout from '@/pages/GlobalLayout';
import MapWithPostsLayout from '@/pages/map/MapWithPostsLayout';
import MapWithSidepanelsLayout from '@/pages/map/map-with-sidepanels/MapWithSidepanelsLayout';
import {
  MoveBottomSheetMiddle,
  MoveBottomSheetUp,
} from '@/reusable-components/effects/BottomSheetPositionEffect';
import { LandingPage } from '@/reusable-components/landing-page/LandingPage';
import InvestmentDetails from '@/reusable-components/post-details/investment-details/InvestmentDetails';
import NamedRoute from './named-outlet/NamedRoute';
import LoginPage from '@/pages/map/map-with-sidepanels/login/LoginPage';
import RegisterPage from '@/pages/map/map-with-sidepanels/register/RegisterPage';
import InvestmentsPage from '@/pages/map/map-with-sidepanels/investments/InvestmentsPage';
import OfficialLayout from '@/pages/official/OfficialLayout';
import PostTypeEffect from '@/reusable-components/effects/PostTypeEffect';
import { ANNOUNCEMENT_NAME, INVESTMENT_NAME, LISTING_NAME } from '@/strings';
import { OpenOnlyLeftPanel } from '@/reusable-components/effects/LeftPanelStateEffect';
import ListingsPage from '@/pages/map/map-with-sidepanels/listings/ListingsPage';
import ListingDetails from '@/reusable-components/post-details/listing-details/ListingDetails';
import ClearCommentsEffect from '@/reusable-components/effects/ClearCommentsEffect';
import AnnouncementDetails from '@/reusable-components/post-details/announcement-details/AnnouncementDetails';
import AnnouncementsPage from '@/pages/map/map-with-sidepanels/announcements/AnnouncementsPage';
import InvestmentCreatePage from '@/pages/map/map-with-sidepanels/investment/InvestmentCreatePage';
import InvestmentEditPage from '@/pages/map/map-with-sidepanels/investment/InvestmentEditPage';
import AnnouncementCreatePage from '@/pages/map/map-with-sidepanels/announcement/AnnouncementCreatePage';
import AnnouncementEditPage from '@/pages/map/map-with-sidepanels/announcement/AnnouncementEditPage';
import ListingCreatePage from '@/pages/map/map-with-sidepanels/listing/ListingCreatePage';
import ListingEditPage from '@/pages/map/map-with-sidepanels/listing/ListingEditPage';
import ClearPhoneLayoutEffect from '@/reusable-components/effects/ClearPhoneLayoutEffect';
import ForgotPasswordPage from '@/pages/map/forgot-password/ForgotPasswordPage';
import InvestmentComments from '@/pages/map/map-with-sidepanels/investment/InvestmentComments';
import AnnouncementComments from '@/pages/map/map-with-sidepanels/announcement/AnnouncementComments';
import OfficialPage from '@/pages/official/OfficialPage';

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
                    outlets={[
                      { name: 'left', content: <ForgotPasswordPage /> },
                    ]}
                    effect={
                      <>
                        <MoveBottomSheetUp />
                        <OpenOnlyLeftPanel />
                      </>
                    }
                  />
                ),
              },
              {
                path: ROUTES.MAP.LANDING_PAGE.path(),
                element: (
                  <NamedRoute
                    outlets={[{ name: 'left', content: <LandingPage /> }]}
                    effect={
                      <>
                        <MoveBottomSheetMiddle />
                        <OpenOnlyLeftPanel />
                      </>
                    }
                  />
                ),
              },
              {
                path: ROUTES.MAP.LOGIN.path(),
                element: (
                  <NamedRoute
                    outlets={[{ name: 'left', content: <LoginPage /> }]}
                    effect={
                      <>
                        <MoveBottomSheetUp />
                        <OpenOnlyLeftPanel />
                      </>
                    }
                  />
                ),
              },
              {
                path: ROUTES.MAP.REGISTER.path(),
                element: (
                  <NamedRoute
                    outlets={[{ name: 'left', content: <RegisterPage /> }]}
                    effect={
                      <>
                        <MoveBottomSheetUp />
                        <OpenOnlyLeftPanel />
                      </>
                    }
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
                      {
                        name: 'right',
                        content: <InvestmentComments />,
                      },
                    ]}
                    effect={
                      <>
                        <PostTypeEffect postType={INVESTMENT_NAME} />
                        <MoveBottomSheetUp />
                        <ClearCommentsEffect />
                        <ClearPhoneLayoutEffect />
                      </>
                    }
                  />
                ),
              },
              {
                path: ROUTES.MAP.INVESTMENTS.path(),
                element: (
                  <NamedRoute
                    outlets={[{ name: 'left', content: <InvestmentsPage /> }]}
                    effect={
                      <>
                        <PostTypeEffect postType={INVESTMENT_NAME} />
                        <MoveBottomSheetUp />
                        <OpenOnlyLeftPanel />
                      </>
                    }
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
                    effect={
                      <>
                        <MoveBottomSheetUp />
                        <OpenOnlyLeftPanel />
                      </>
                    }
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
                    effect={
                      <>
                        <MoveBottomSheetUp />
                        <OpenOnlyLeftPanel />
                      </>
                    }
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
                        content: <AnnouncementComments />,
                      },
                    ]}
                    effect={
                      <>
                        <PostTypeEffect postType={ANNOUNCEMENT_NAME} />
                        <MoveBottomSheetUp />
                        <ClearPhoneLayoutEffect />
                      </>
                    }
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
                    effect={
                      <>
                        <PostTypeEffect postType={ANNOUNCEMENT_NAME} />
                        <MoveBottomSheetUp />
                        <OpenOnlyLeftPanel />
                      </>
                    }
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
                    effect={<MoveBottomSheetUp />}
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
                    effect={
                      <>
                        <MoveBottomSheetUp />
                        <OpenOnlyLeftPanel />
                      </>
                    }
                  />
                ),
              },
              {
                path: ROUTES.MAP.LISTING.BY_NAME.path(':name'),
                element: (
                  <NamedRoute
                    outlets={[
                      {
                        name: 'left',
                        content: <ListingDetails />,
                      },
                    ]}
                    effect={
                      <>
                        <PostTypeEffect postType={LISTING_NAME} />
                        <MoveBottomSheetUp />
                        <OpenOnlyLeftPanel />
                      </>
                    }
                  />
                ),
              },
              {
                path: ROUTES.MAP.LISTINGS.path(),
                element: (
                  <NamedRoute
                    outlets={[{ name: 'left', content: <ListingsPage /> }]}
                    effect={
                      <>
                        <PostTypeEffect postType={LISTING_NAME} />
                        <MoveBottomSheetUp />
                        <OpenOnlyLeftPanel />
                      </>
                    }
                  />
                ),
              },
              {
                path: ROUTES.MAP.LISTING_CREATE.path(),
                element: (
                  <NamedRoute
                    outlets={[{ name: 'left', content: <ListingCreatePage /> }]}
                    effect={
                      <>
                        <MoveBottomSheetUp />
                        <OpenOnlyLeftPanel />
                      </>
                    }
                  />
                ),
              },
              {
                path: ROUTES.MAP.LISTING_EDIT.BY_NAME.path(':name'),
                element: (
                  <NamedRoute
                    outlets={[{ name: 'left', content: <ListingEditPage /> }]}
                    effect={
                      <>
                        <MoveBottomSheetUp />
                        <OpenOnlyLeftPanel />
                      </>
                    }
                  />
                ),
              },
            ],
          },
        ],
      },
      {
        path: ROUTES.OFFICIAL.path(),
        element: <OfficialLayout />,
        children: [
          {
            path: ROUTES.OFFICIAL.path(),
            element: <OfficialPage />,
          },
          {
            path: ROUTES.OFFICIAL.NEWSLETTER.path(),
            children: [
              {
                path: ROUTES.OFFICIAL.NEWSLETTER.path(),
                element: <div>Here there be a newsletter editor</div>,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to={ROUTES.MAP.LANDING_PAGE.path()} />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.MAP.LANDING_PAGE.path()} />,
  },
]);
