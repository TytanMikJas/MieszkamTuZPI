import React from 'react';
import IconLoopStandard from '@/reusable-components/lordicon/IconLoopStandard';
import bafSimpleIcon from '@/lordicon/bafSimpleIcon.json';
import bafGraphicIcon from '@/lordicon/bafGraphicIcon.json';
import { Link } from 'react-router-dom';
import { Button } from '@/shadcn/button';
import { ROUTES } from '@/core/routing/Router';
import HelpPopover from '@/reusable-components/HelpPopover';
import { MaterialSymbol } from 'react-material-symbols';

interface BAFChooseCalculatorTypeProps {
  isRedirectBoth: boolean;
  isActiveOnSimple: boolean;
  isActiveOnGraphic: boolean;
}

export function BAFChooseCalculatorType({
  isRedirectBoth,
  isActiveOnSimple,
  isActiveOnGraphic,
}: BAFChooseCalculatorTypeProps) {
  return (
    <div className="flex flex-col items-center text-center text-base">
      <h1 className="text-2xl font-medium">
        Wybierz odpowiedni kalkulator dla siebie
      </h1>
      <p className="w-5/6 font-medium pt-2">
        Mamy kalkulator prosty oraz graficzny.
      </p>
      <div className="container mx-auto p-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center text-center p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Kalkulator Prosty</h2>
            <IconLoopStandard
              icon={bafSimpleIcon}
              sizes={{ sm: 100, md: 150, lg: 200 }}
            ></IconLoopStandard>
            <ul className="list-disc text-left mt-4 ml-4 flex-grow">
              <li>Wybierz jeżeli znasz dokładne wymiary swojej działki</li>
              <li>Rekomendowany do użycia profesjonalnego</li>
              <li>Manualne wprowadzanie danych do kalkulatora</li>
              <li>Dostępny na każdym urządzeniu</li>
            </ul>
            <Link to={ROUTES.BAF_CALCULATOR_SIMPLE.path()}>
              <Button
                disabled={!isRedirectBoth && isActiveOnSimple}
                className="mt-4 self-end mb-2"
              >
                Przejdź do kalkulatora prostego
              </Button>
            </Link>
          </div>

          <div className="flex flex-col items-center text-center p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Kalkulator Graficzny</h2>
            <IconLoopStandard
              icon={bafGraphicIcon}
              sizes={{ sm: 100, md: 150, lg: 200 }}
            ></IconLoopStandard>
            <ul className="list-disc text-left mt-4 ml-4 flex-grow">
              <li>Wybierz jeżeli nie znasz wymiarów swojej działki</li>
              <li>Rekomendowany do użycia osobistego</li>
              <li>Interaktywne wprowadzanie danych na mapę</li>
              <li>Niedostępny na małych ekranach</li>
            </ul>
            <Link to={ROUTES.BAF_CALCULATOR_GRAPHIC.path()}>
              <Button
                disabled={!isRedirectBoth && isActiveOnGraphic}
                className="mt-4 self-end mb-2"
              >
                Przejdź do kalkulatora graficznego
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-row border items-center rounded-lg mt-5 p-4 mb-2">
          <HelpPopover
            icon={<MaterialSymbol size={72} icon="help" color="#2b6cb0" />}
            htmlContent={
              <p className="text-sm">W tym miejscu pojawi się wyjaśnienie.</p>
            }
          />
          <p className="ml-4 text-left">
            Jeśli coś jest niejasne, w każdym momencie możesz kliknąć w ikonę
            znaku zapytania umieszczoną obok danego pojęcia. Na ekranie pojawi
            się wtedy wytłumaczenie.
          </p>
        </div>
      </div>
    </div>
  );
}
