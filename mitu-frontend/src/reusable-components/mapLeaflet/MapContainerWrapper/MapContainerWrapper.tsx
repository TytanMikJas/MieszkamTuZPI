import { MAP_MIN_ZOOM } from '../../../constants';
import React from 'react';
import { MapContainer } from 'react-leaflet';
import { useMapSettingsStore } from '../../../core/stores/map/map-settings-store';

export default function MapContainerWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!React.isValidElement(children)) {
    throw new Error('Child is not a valid React element');
  }
  const { center, zoom } = useMapSettingsStore();
  return (
    <MapContainer
      className={'h-full w-full z-0'}
      center={center}
      zoom={zoom}
      minZoom={MAP_MIN_ZOOM}
      zoomSnap={0.4}
      scrollWheelZoom={true}
    >
      {children}
    </MapContainer>
  );
}
