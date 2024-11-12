// W pliku BafSimplePage.tsx
import React, { useState } from 'react';
import BAFTable from './components/BAFTable';
import BAFResults from './components/BAFResults';

export default function BafSimplePage() {
  const [totalArea, setTotalArea] = useState(0);
  const [totalBAF, setTotalBAF] = useState(0);

  const handleBAFDataChange = (newTotalArea, newTotalBAF) => {
    setTotalArea(newTotalArea);
    setTotalBAF(newTotalBAF);
  };

  return (
    <div className="mx-auto max-w-screen-2xl flex flex-col h-full">
      <div className="flex-1 overflow-auto p-2 mb-2 md:p-4 md:mb-4">
        <BAFTable onBAFDataChange={handleBAFDataChange} />
      </div>
      <div className="h-1/5 flex-none">
        <BAFResults totalArea={totalArea} totalBAF={totalBAF} />
      </div>
    </div>
  );
}
