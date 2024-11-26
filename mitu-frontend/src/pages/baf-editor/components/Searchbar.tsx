import { useEffect, useState } from 'react';

import { useBafEditorStore } from '@/core/stores/map/baf-editor-store';
import { Input } from '@/shadcn/input';
import { emitError } from '@/toast-actions';
import SearchIcon from '@/reusable-components/icons/search-icon/SearchIcon';
import BAFTutorial from '@/pages/baf-simple/components/BAFTutorial';
import BAFInfo from '@/pages/baf-simple/components/BAFInfo';

function Searchbar() {
  const { parcelLoading, getParcelShapeByName, getAddressCoordinates } =
    useBafEditorStore();
  const [searchbarValue, setSearchbarValue] = useState('');
  const [selectedType, setSelectedType] = useState(1);
  const handleSearchbarChange = (event) => {
    setSearchbarValue(event.target.value);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  const handleSearch = () => {
    if (selectedType == 0) {
      const splitted = searchbarValue.split(',');
      if (splitted.length != 2) {
        return emitError('Niepoprawny format wyszukiwania');
      }
      const region = splitted[0].trim();
      const number = splitted[1].trim();
      getParcelShapeByName({ region, number });
    } else {
      getAddressCoordinates({ address: searchbarValue });
    }
  };

  useEffect(() => {
    setSearchbarValue('');
  }, [selectedType]);

  return (
    <div className="absolute flex flex-col w-96 left-16 top-3 shadow-lg rounded-lg overflow-hidden z-[1000]">
      <div className="flex bg-white rounded-t-2xl">
        <div
          onClick={() => handleTypeChange(0)}
          className={
            selectedType == 0
              ? 'flex w-full justify-center items-center p-1 bg-gray-200 shadow-[inset_-3px_-51px_19px_-62px_rgba(0,0,0,1)] bg-primary text-white shadow-none'
              : 'flex w-full justify-center items-center p-1 bg-gray-200 shadow-[inset_-3px_-51px_19px_-62px_rgba(0,0,0,1)]'
          }
        >
          Obręb, numer działki
        </div>
        <div
          onClick={() => handleTypeChange(1)}
          className={
            selectedType == 1
              ? 'flex w-full justify-center items-center p-1 bg-gray-200 shadow-[inset_-3px_-51px_19px_-62px_rgba(0,0,0,1)] bg-primary text-white shadow-none'
              : 'flex w-full justify-center items-center p-1 bg-gray-200 shadow-[inset_-3px_-51px_19px_-62px_rgba(0,0,0,1)]'
          }
        >
          Adres
        </div>
      </div>

      <div className="flex justify-between flex-col bg-white p-2 gap-2">
        {selectedType == 1 ? (
          <p className="pl-1">
            Wpisz ulicę i/lub numer budynku.<br></br> Możesz także wybrać swoją
            działkę klikając na jej obszar na mapie.
          </p>
        ) : (
          <p className="pl-1">
            Użyj tej opcji tylko jeśli znasz swój obręb oraz numer działki.
            Możesz także wybrać swoją działkę klikając na jej obszar na mapie.
          </p>
        )}

        <div className="flex justify-center items-center gap-4 pt-1">
          <Input
            onChange={handleSearchbarChange}
            id="locSearchBar"
            defaultValue="Small"
            style={{ width: '20rem' }}
            value={searchbarValue}
            placeholder={
              selectedType == 0 ? 'np. Klecina, 51' : 'np. Brochowska 1'
            }
          />
          <SearchIcon onClick={handleSearch} />
        </div>
      </div>

      <div className="flex justify-between flex-col p-2 bg-white">
        <div className="flex justify-center items-center gap-4">
          <BAFInfo />
          <BAFTutorial
            isRedirectBoth={false}
            isActiveOnSimple={false}
            isActiveOnGraphic={true}
          />
        </div>
      </div>
    </div>
  );
}

export default Searchbar;
