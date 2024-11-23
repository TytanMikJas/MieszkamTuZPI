import { ROUTES } from '@/core/routing/Router';
import PanelButton from '@/reusable-components/panel-button/PanelButton';
import { useNavigate } from 'react-router-dom';

export default function OfficialButtons() {
  const navigate = useNavigate();
  return (
    <div className="flex">
      <div className="grid grid-cols-2 gap-10 text-center">
        <PanelButton
          text="Kreator inwestycji"
          icon="construction"
          onClick={() => navigate(ROUTES.MAP.INVESTMENT_CREATE.path())}
        />
        <PanelButton
          text="Kreator ogłoszeń"
          icon="construction"
          onClick={() => navigate(ROUTES.MAP.ANNOUNCEMENT_CREATE.path())}
        />

        <PanelButton
          text="Kreator nieruchomości"
          icon="construction"
          onClick={() => navigate(ROUTES.MAP.LISTING_CREATE.path())}
        />

        <PanelButton
          text="Panel newsletterów"
          icon="mail"
          onClick={() => navigate(ROUTES.OFFICIAL.NEWSLETTER.path())}
        />
      </div>
    </div>
  );
}
