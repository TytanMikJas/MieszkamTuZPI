import React, { useMemo, useState, useEffect } from 'react';
import IconOnlyButton from '@/reusable-components/IconOnlyButton';
import { MaterialSymbol } from 'react-material-symbols';
import HelpPopover from '@/reusable-components/HelpPopover';
import BAFTutorial from './BAFTutorial';
import BAFInfo from './BAFInfo';

interface BAFResultsProps {
  totalBAF: number;
  totalArea: number;
}

const BAFResults: React.FC<BAFResultsProps> = ({ totalBAF, totalArea }) => {
  const { bafValue, comment, commentColor } = useMemo(() => {
    const value = totalArea > 0 ? (totalBAF / totalArea).toFixed(2) : null;
    let comment = 'Uzupełnij tabelę, aby otrzymać wynik';
    let commentColor = 'text-gray-500';

    if (value) {
      const numericValue = parseFloat(value);
      if (numericValue >= 0.75) {
        comment = 'To bardzo dobry wynik. Gratulacje!';
        commentColor = 'text-green-600';
      } else if (numericValue >= 0.5) {
        comment = 'Prawidłowy wynik. Gratulacje!';
        commentColor = 'text-green-500';
      } else if (numericValue < 0.5) {
        comment = 'Twój BAF jest zbyt niski.';
        commentColor = 'text-red-500';
      } else {
        comment = 'Uzupełnij tabelę, aby otrzymać wynik';
        commentColor = 'text-red-500';
      }
    }

    return { bafValue: value, comment, commentColor };
  }, [totalBAF, totalArea]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-1/5 bg-gray-50 flex items-center justify-center">
      <div className="w-full flex justify-between items-center max-w-screen-2xl">
        <div>
          <BAFInfo />
        </div>

        <div className="text-center">
          <div className="flex justify-center items-center mb-2">
            <p>Wartość BAF</p>
            <HelpPopover
              htmlContent={
                <div>
                  <p className="text-sm">
                    Wartość BAF to iloraz całkowitej powierzchni BAF i
                    całkowitej powierzchni działki
                  </p>
                  <p className="font-bold text-center mt-2">
                    {bafValue !== null
                      ? `${totalBAF} ÷ ${totalArea} = ${bafValue}`
                      : 'Brak danych. Uzupełnij tabelę.'}
                  </p>
                </div>
              }
            />
          </div>
          <div className="text-black text-3xl font-bold  mb-2">
            {bafValue !== null ? bafValue : 'Brak danych'}
          </div>
          <div className={`${commentColor} mt-2`}>
            {typeof comment === 'string' ? comment : ''}
          </div>
        </div>
        <div className="mr-4">
          <BAFTutorial
            isRedirectBoth={false}
            isActiveOnSimple={true}
            isActiveOnGraphic={false}
          />
        </div>
      </div>
    </div>
  );
};

export default BAFResults;
