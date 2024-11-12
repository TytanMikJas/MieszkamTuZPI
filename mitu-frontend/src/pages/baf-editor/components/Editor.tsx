import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shadcn/dialog';
import { useBafEditorStore } from '@/core/stores/map/baf-editor-store';
import { useEffect, useState } from 'react';
import { Input } from '@/shadcn/input';
import { Label } from '@/shadcn/label';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/select';
import { Button } from '@/shadcn/button';
import CrossIcon from '@/reusable-components/icons/cross-icon/CrossIcon';
import Layer from './Layer';
import { SelectContent } from '@radix-ui/react-select';
import UndoIcon from '@/reusable-components/icons/undo-icon/UndoIcon';
import HelpPopover from '@/reusable-components/HelpPopover';
import { MaterialSymbol } from 'react-material-symbols';

function Editor() {
  const {
    layers,
    area,
    parcelData,
    additionModal,
    indicators,
    surfaces,
    currentlySelectedLayerIndex,
    redoMarker,
    openAdditionModal,
    closeAdditionModal,
    addNewLayer,
    clearParcelData,
  } = useBafEditorStore();

  const [localBAF, setLocalBAF] = useState(0);

  const [localSurfaceSelection, setLocalSurfaceSeletion] = useState(
    Object.keys(surfaces).length > 0 ? Object.keys(surfaces)[0] : '',
  );
  const [localSurfaceOwnName, setLocalSurfaceOwnName] = useState('');

  const [localIndicatorSelection, setLocalIndicatorSelection] = useState(
    Object.keys(indicators).length > 0 ? Object.keys(indicators)[0] : '',
  );

  const handleRedoMarker = () => {
    redoMarker();
  };

  const handleModalOpen = () => {
    openAdditionModal();
  };

  const handleOwnNameChange = (event: any) => {
    setLocalSurfaceOwnName(event.target.value);
  };

  const handleModalClose = () => {
    closeAdditionModal();
  };

  useEffect(() => {
    setLocalSurfaceOwnName('');
  }, [additionModal]);

  const handleAddLayer = () => {
    addNewLayer({
      polygon: [],
      surfaceType: localSurfaceSelection,
      color: surfaces[localSurfaceSelection].color,
      ownName: localSurfaceOwnName,
    });
    handleModalClose();
  };

  const handleDeselectParcel = () => {
    clearParcelData();
  };

  const handleSelectChange = (value) => {
    setLocalSurfaceSeletion(value);
  };

  const handleIndicatorChange = (value) => {
    setLocalIndicatorSelection(value);
  };

  useEffect(() => {
    let outcome_baf = 0;
    layers.forEach((layer) => {
      const multiplier = surfaces[layer.surfaceType].value;
      outcome_baf += layer.area * multiplier;
    });
    const baf_i = parseFloat((outcome_baf / area).toFixed(2));
    setLocalBAF(baf_i);
  }, [layers.reduce((a, e) => a + e.area, 0)]);

  const handleOpenChanged = (open: boolean) => {
    if (!open) {
      handleModalClose();
    }
  };

  const am = (
    <Dialog onOpenChange={handleOpenChanged} open={additionModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Definicja powierzchni{' '}
            <HelpPopover
              htmlContent={
                <div>
                  <p className="text-sm">
                    Wybierz typ powierzchni (formy zagospodarowania terenu) z
                    listy a następnie zaznacz go obrysowując jego kształt na
                    mapie.
                  </p>
                  <p className="text-sm">
                    Jeśli wybrano np. trawa - zaznacz kontury swojego trawnika
                    na mapie. Jeśli masz kilka obszarów trawy na działce -
                    utwórz kilka warstw
                  </p>
                </div>
              }
            />
          </DialogTitle>
          <DialogDescription>
            <p>Wybierz typ powierzchni jaki chcesz zaznaczyć na mapie</p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-between items-center gap-6 py-2">
          <div className="flex flex-col w-full gap-4 my-8 justify-around">
            <div className="flex justify-center items-center gap-1 w-full">
              <div
                style={{
                  backgroundColor: `${
                    surfaces[localSurfaceSelection]
                      ? surfaces[localSurfaceSelection].color
                      : ''
                  }`,
                }}
                className="w-12 h-12 border-2 border-gray-300 rounded-lg"
              ></div>

              <Select
                defaultValue={localSurfaceSelection}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz rodzaj powierzchni" />
                </SelectTrigger>
                <SelectContent className="bg-white p-2 rounded">
                  {Object.keys(surfaces).map((key, i) => (
                    <SelectItem key={i} value={surfaces[key].name}>
                      {surfaces[key].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <div className="flex justify-start items-center">
                <Label htmlFor="surfaceOwnName">Nazwa własna powierzchni</Label>
                <HelpPopover content='Nazwa pozwala lepiej zidentyfikować wiersze w tabeli. Jest to opcjonalne pole. Przykłady nazwy to np.: "Drzewa sprzed domu", "Krzewy przy płocie"' />
              </div>
              <Input id="surfaceOwnName" onChange={handleOwnNameChange} />
            </div>
          </div>
          <div className="flex gap-2.5"></div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddLayer} color="primary">
            Dodaj
          </Button>
          <Button onClick={handleModalClose} color="light">
            Anuluj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="flex flex-col w-[25rem] h-[93vh] absolute right-0 top-0 z-[2000] bg-white shadow">
      {currentlySelectedLayerIndex != -1 &&
        layers[currentlySelectedLayerIndex] &&
        layers[currentlySelectedLayerIndex].polygon.length > 0 && (
          <div
            className="z-[1999] bg-white absolute -left-12 top-4 flex justify-center items-center w-10 h-10 rounded-full shadow cursor-pointer"
            onClick={handleRedoMarker}
          >
            <UndoIcon />
          </div>
        )}
      <div className="flex flex-col ">
        <div className="bg-primary text-white font-medium p-2 flex justify-between items-center">
          Wybrana działka
          <CrossIcon className="text-white" onClick={handleDeselectParcel} />
        </div>
        <div className="bg-white flex gap-4 p-4">
          <div className="text-[#green] font-semibold text-lg">
            {parcelData.parcelRegion}
          </div>
          <div className="text-[#border_grey] font-semibold text-lg">
            {parcelData.parcelNumber}
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full">
        <div className="flex justify-center items-center">
          <Button
            onClick={handleModalOpen}
            disabled={currentlySelectedLayerIndex != -1}
            variant="default"
            className="w-1/2"
          >
            Dodaj warstwę
          </Button>
          <HelpPopover
            htmlContent={
              <div className="w-full">
                <p className="text-sm">
                  Po dodaniu warstwy kliknij na przycisk{' '}
                  <MaterialSymbol
                    icon="add"
                    size={30}
                    fill
                    grade={25}
                    className={'text-primary mt-0'}
                  />
                  <br></br>
                  Następnie na mapie zaznacz obszar, który zajmuje dany typ
                  powierzchni.<br></br>
                  Klikaj na mapę w odpowiednie miejsca, aby utworzyć kształt
                  obszaru.<br></br>
                  Kiedy skończysz definiować obszar, kliknij ponownie na
                  przycisk{' '}
                  <MaterialSymbol
                    icon="add"
                    size={30}
                    fill
                    grade={25}
                    className={'text-primary mt-0'}
                  />{' '}
                  aby zakończyć edycje warstwy.<br></br>
                  <br></br>
                  Przycisk
                  <MaterialSymbol
                    icon="close"
                    size={30}
                    fill
                    grade={25}
                    className={'text-primary mt-0'}
                  />{' '}
                  usuwa daną warstwę.
                </p>
              </div>
            }
          />
        </div>

        <div className="flex flex-col p-2 gap-4 h-full overflow-y-scroll scrollable-vertical">
          {layers.map((layer, index) => (
            <Layer key={index} index={index} layer={layer} />
          ))}
        </div>

        <div className="flex flex-col">
          <div className="flex justify-start items-center border-t-2 border-gray-200 p-4 pb-0">
            Rodzaj zabudowy na działce
            <HelpPopover
              htmlContent={
                <div>
                  <p className="text-sm">
                    Wybierz z listy rodzaj zabudowy, jaki znajduje się na
                    działce. Każdy rodzaj zabudowy ma inną sugerowaną wartość
                    BAF jaką powinien osiągnąć.
                  </p>
                </div>
              }
            />
          </div>
          <div className="flex justify-center items-center p-4">
            <Select
              defaultValue={localIndicatorSelection}
              onValueChange={handleIndicatorChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz rodzaj zabudowy" />
              </SelectTrigger>
              <SelectContent className="bg-white p-2 rounded">
                {Object.keys(indicators).map((key) => (
                  <SelectItem value={key}>{key}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            style={{
              backgroundColor:
                localBAF >
                (indicators[localIndicatorSelection]
                  ? indicators[localIndicatorSelection]
                  : 0)
                  ? 'bg-green-500'
                  : 'bg-red-300',
            }}
            className="bg-gray-300 text-white flex justify-center items-center py-[0.8rem]"
          >
            <p>Wartość BAF</p>
            <HelpPopover
              htmlContent={
                <div>
                  <p className="text-sm">
                    Wartość BAF to iloraz całkowitej powierzchni BAF i
                    całkowitej powierzchni działki.<br></br>Wynik przedstawiony
                    jest w formacie:
                  </p>
                  <p className="font-bold text-center mt-2">
                    twoja wartość BAF {`>`} sugerowana wartość BAF dla wybranego
                    rodzaju zabudowy
                  </p>
                </div>
              }
            />
          </div>
          <div className="flex justify-center items-center text-[3rem] font-medium gap-4">
            <div>{localBAF ? localBAF : 0}</div>
            <div>
              {indicators[localIndicatorSelection]
                ? indicators[localIndicatorSelection] > localBAF
                  ? '>'
                  : '<'
                : ''}
            </div>
            <div>
              {indicators[localIndicatorSelection]
                ? indicators[localIndicatorSelection]
                : ''}
            </div>
          </div>
        </div>
      </div>

      {am}
    </div>
  );
}

export default Editor;
