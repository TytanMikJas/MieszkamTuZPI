import Map from './components/Map';
import Editor from './components/Editor';
import Searchbar from './components/Searchbar';
import ConfirmationModal from './components/ConfirmationModal';
import SwitchToDesktop from './components/SwitchToDesktop';
import { useBafEditorStore } from '@/core/stores/map/baf-editor-store';
import { useMediaQuery } from 'react-responsive';

export default function BAFCalculator() {
  const isMobileWidth = useMediaQuery({ maxWidth: 900 });
  const isMobileHeight = useMediaQuery({ maxHeight: 500 });

  const {
    infoModal,
    parcelData,
    parcelLoading,
    editorLoading,
    parcelSelected,
    closeInfoModal,
    clearParcelData,
    getParcelShape,
  } = useBafEditorStore();

  const handleModalClose = () => {
    closeInfoModal();
  };

  const handleClearParcel = () => {
    clearParcelData();
  };

  const handleConfirmChoice = () => {
    getParcelShape({ x: parcelData.x, y: parcelData.y });
  };

  return isMobileWidth || isMobileHeight ? (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <SwitchToDesktop></SwitchToDesktop>
    </div>
  ) : (
    <div className="flex relative justify-center h-[93vh] w-full">
      <Map />
      {parcelSelected && <Editor />}
      {!parcelSelected && <Searchbar />}
      <ConfirmationModal
        open={infoModal}
        parcelData={parcelData}
        parcelLoading={parcelLoading}
        editorLoading={editorLoading}
        handleConfirmChoice={handleConfirmChoice}
        handleClearParcel={handleClearParcel}
        handleModalClose={handleModalClose}
      />
    </div>
  );
}
