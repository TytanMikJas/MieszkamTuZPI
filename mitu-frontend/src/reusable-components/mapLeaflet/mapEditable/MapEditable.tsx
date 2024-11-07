import React, { useMemo, useRef, useEffect } from 'react';
import MapContainerWrapper from '../MapContainerWrapper/MapContainerWrapper';
import { Marker, Polygon, TileLayer, useMapEvents } from 'react-leaflet';
import { useMapEditStore } from '../../../core/stores/map/map-edit-store';
import { LatLng, LeafletMouseEvent } from 'leaflet';
import { Button } from '@/shadcn/button';
import {
  MAP_CMD_EDIT_AREA,
  MAP_CMD_EDIT_LOCATION,
  MAP_CMD_EDIT_OFF,
  MAP_DESCRIPTION_EDIT_AREA,
  MAP_DESCRIPTION_EDIT_LOCATION,
  MAP_DESCRIPTION_EDIT_OFF,
} from '@/strings';
import ToggleButton from '@/reusable-components/buttons/ToggleButton';
import { useMediaQuery } from 'react-responsive';
import CitifiedTileLayer from '@/reusable-components/mapLeaflet/tileLayer/CitifiedTileLayer';

function DraggableMarkerForArea({
  position,
  index,
  polygonRef,
}: {
  position: LatLng;
  index: number;
  polygonRef: React.MutableRefObject<typeof Polygon | null>;
}) {
  const { updatePointInArea, editState } = useMapEditStore();
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          updatePointInArea(index, marker.getLatLng());

          const polygon = polygonRef.current;
          if (polygon != null) {
            const latlngs = polygon.getLatLngs();
            latlngs[0][index] = marker.getLatLng();
            polygon.setLatLngs(latlngs);
          }
        }
      },
    }),
    [],
  );

  return (
    <Marker
      key={index}
      draggable={editState === MAP_CMD_EDIT_AREA}
      position={position}
      eventHandlers={eventHandlers}
      ref={markerRef}
      title={`${index}`}
    />
  );
}

function Area() {
  const { area, addPointToArea, dropPointFromArea, editState } =
    useMapEditStore();
  const polygonRef = useRef(null);

  const onMapClick = (e: LeafletMouseEvent) => {
    addPointToArea(e.latlng);
  };

  const onMapContextMenu = (e: LeafletMouseEvent) => {
    dropPointFromArea();

    const polygon = polygonRef.current;
    if (polygon != null) {
      const latlngs = polygon.getLatLngs();
      latlngs[0].pop();
      polygon.setLatLngs(latlngs);
    }
  };

  const turnOnMapEvents = editState === MAP_CMD_EDIT_AREA;
  const map = useMapEvents({
    click: turnOnMapEvents ? onMapClick : (e: any) => {},
    contextmenu: turnOnMapEvents ? onMapContextMenu : (e: any) => {},
  });
  return (
    <>
      {area.map((point, index) => (
        <DraggableMarkerForArea
          polygonRef={polygonRef}
          index={index}
          position={point}
        />
      ))}
      <Polygon
        ref={polygonRef}
        key={'polygon'}
        pathOptions={{ color: 'blue' }}
        positions={area}
      />
    </>
  );
}
function Location() {
  const { location, setLocation, area, editState } = useMapEditStore();
  const markerRef = useRef(null);

  const turnOnMapEvents = editState === MAP_CMD_EDIT_LOCATION;

  const onMapClick = (e: LeafletMouseEvent) => {
    setLocation(e.latlng);
  };

  const map = useMapEvents({
    click: turnOnMapEvents ? onMapClick : (e: any) => {},
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setLocation(marker.getLatLng());
        }
      },
    }),
    [],
  );

  return (
    <Marker
      draggable={editState === MAP_CMD_EDIT_LOCATION}
      eventHandlers={eventHandlers}
      position={location}
      ref={markerRef}
    />
  );
}
function MapMain() {
  return (
    <>
      <CitifiedTileLayer />
      <Area />
      <Location />
    </>
  );
}

export default function MapEditable() {
  const { setEditState, editState, resetEditStoreState } = useMapEditStore();

  const isEditArea = editState === MAP_CMD_EDIT_AREA;
  const isEditLocation = editState === MAP_CMD_EDIT_LOCATION;
  const isEditOff = editState === MAP_CMD_EDIT_OFF;
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    return () => {
      resetEditStoreState();
    };
  }, []);

  const handleSetEditArea = () => {
    if (!isEditArea) {
      setEditState(MAP_CMD_EDIT_AREA);
    } else {
      setEditState(MAP_CMD_EDIT_OFF);
    }
  };

  const handleSetEditLocation = () => {
    if (isEditLocation) {
      setEditState(MAP_CMD_EDIT_OFF);
    } else {
      setEditState(MAP_CMD_EDIT_LOCATION);
    }
  };

  const handleSetEditOff = () => {
    if (isEditOff) {
      setEditState(MAP_CMD_EDIT_OFF);
    } else {
      setEditState(MAP_CMD_EDIT_OFF);
    }
  };

  const handleClear = () => {
    resetEditStoreState();
  };

  const mapEditStageDesc: any = {
    [MAP_CMD_EDIT_LOCATION]: MAP_DESCRIPTION_EDIT_LOCATION,
    [MAP_CMD_EDIT_AREA]: MAP_DESCRIPTION_EDIT_AREA,
    [MAP_CMD_EDIT_OFF]: MAP_DESCRIPTION_EDIT_OFF,
  };

  return (
    <div className="relatitve w-full h-full -z-10">
      <div className="absolute z-[1000] right-2 md:right-8 top-20 md:top-24 flex flex-col gap-2 items-end w-min">
        {isMobile ? (
          <div>
            <div className="flex justify-end">
              <ToggleButton
                isActive={isEditArea}
                onClick={handleSetEditArea}
                className="mr-2"
              >
                Obszar
              </ToggleButton>

              <ToggleButton
                isActive={isEditLocation}
                onClick={handleSetEditLocation}
              >
                Lokalizacja
              </ToggleButton>
            </div>
            <div className="mt-2 flex justify-end">
              <ToggleButton
                isActive={isEditOff}
                onClick={handleSetEditOff}
                className="mr-2"
              >
                Zablokuj
              </ToggleButton>
              <Button onClick={handleClear}>Wyczyść</Button>
            </div>
            <div
              className="
                mt-2
              bg-white
                rounded-lg
                px-4
                py-2
                text-justify
                w-60"
            >
              {mapEditStageDesc[editState]}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex gap-2 justify-between">
              <ToggleButton isActive={isEditArea} onClick={handleSetEditArea}>
                Obszar
              </ToggleButton>

              <ToggleButton
                isActive={isEditLocation}
                onClick={handleSetEditLocation}
              >
                Lokalizacja
              </ToggleButton>
              <ToggleButton isActive={isEditOff} onClick={handleSetEditOff}>
                Zablokuj
              </ToggleButton>
              <Button onClick={handleClear}>Wyczyść</Button>
            </div>
            <div
              className="
                bg-white
                rounded-lg
                px-4
                py-2
                text-justify
                w-auto
                mt-2"
            >
              {mapEditStageDesc[editState]}
            </div>
          </div>
        )}
      </div>

      <MapContainerWrapper>
        <MapMain />
      </MapContainerWrapper>
    </div>
  );
}
