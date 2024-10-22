import IconLoopStandard from '../lordicon/IconLoopStandard';
import cityHallIcon from '../../lordicon/city-hall.json';
import consultationIcon from '../../lordicon/consultation.json';
import consultationAltIcon from '../../lordicon/consultationAlt.json';
import { Separator } from '../../shadcn/separator';
import { Button } from '../../shadcn/button';
import { LandingPageTabs } from './LandingPageTabs';
import AuthGuard from '../../core/auth/AuthGuard';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../core/routing/Router';
import { PhoneLayoutSnap, useUiStore } from '@/core/stores/ui-store';

export function LandingPage() {
  const uiStore = useUiStore();

  return (
    <div className="flex flex-col items-center text-center text-base">
      <h1 className="text-2xl font-medium pt-8">Witamy na stronie głównej</h1>
      <h1 className="text-2xl font-bold pb-6">MieszkamTu!</h1>

      <p className="w-5/6 font-medium">
        Nasza aplikacja została stworzona z myślą o ułatwieniu komunikacji
        pomiędzy mieszkańcami a miastem. Serdecznie zachęcamy do aktywnego
        udziału w dyskusiach dotyczących inwestycji i ogłoszeń, jak i zapoznania
        się z oferowanymi nieruchomościami. Dołącz do nas i wspólnie
        uczestniczmy w kształtowaniu przyszłości naszego miasta!
      </p>

      <div className="flex flex-row items-end justify-center pb-2">
        <IconLoopStandard
          icon={consultationAltIcon}
          sizes={{ sm: 75, md: 100, lg: 130 }}
        ></IconLoopStandard>
        <IconLoopStandard
          icon={cityHallIcon}
          sizes={{ sm: 100, md: 150, lg: 200 }}
        ></IconLoopStandard>
        <IconLoopStandard
          icon={consultationIcon}
          sizes={{ sm: 75, md: 100, lg: 130 }}
        ></IconLoopStandard>
      </div>

      <div className="w-11/12 text-left h-max">
        <LandingPageTabs />
      </div>

      <AuthGuard
        allowedRoles={['ANONYMOUS']}
        renderAllowed={
          <>
            <div className="pt-8 w-4/6 pb-4 ">
              <Separator />
            </div>

            <h3 className="text-lg font-semibold mb-4">Dołącz do nas</h3>

            <div className="space-x-4">
              <Link to={ROUTES.MAP.LOGIN.path()}>
                <Button
                  onClick={() =>
                    uiStore.setCurrentBottomSheetSnap(PhoneLayoutSnap.TOP)
                  }
                >
                  Zaloguj się
                </Button>
              </Link>
              <Link to={ROUTES.MAP.REGISTER.path()}>
                <Button>Utwórz konto</Button>
              </Link>
            </div>
          </>
        }
      />
    </div>
  );
}
