import {
  MapContainer,
  Polygon,
  TileLayer,
  WMSTileLayer,
  Marker,
} from 'react-leaflet';
import L from 'leaflet';
import { useMap, useMapEvents } from 'react-leaflet/hooks';

import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';

import { useBafEditorStore } from '@/core/stores/map/baf-editor-store';
import PanelLoader from '@/reusable-components/loaders/PanelLoader';
import { emitError } from '@/toast-actions';

function Map(props) {
  const {
    mapPositionCenter,
    parcelLoading,
    parcelSelected,
    currentlySelectedLayerIndex,
    zoomToCoords,
  } = useBafEditorStore();

  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(mapPositionCenter, 12);
    }
  }, [mapPositionCenter]);

  useEffect(() => {
    const mapContainer = document.querySelector('.leaflet-container');

    if (currentlySelectedLayerIndex != -1 && mapContainer) {
      mapContainer.style.cursor = 'crosshair';
    } else {
      mapContainer.style.cursor = 'grab';
    }
  }, [currentlySelectedLayerIndex]);

  useEffect(() => {
    if (zoomToCoords && mapRef.current) {
      mapRef.current.setView(zoomToCoords, 20);
    }
  }, [zoomToCoords]);

  useEffect(() => {
    if (!parcelSelected && mapRef.current) {
      mapRef.current.setMaxBounds(null);
    }
  }, [parcelSelected]);

  return (
    <div className="h-[93vh] w-full relative">
      <MapContainer
        ref={mapRef}
        className="h-[93vh]"
        center={mapPositionCenter}
        zoom={15}
        maxZoom={22}
        minZoom={10}
        scrollWheelZoom={false}
      >
        <MapComponent mapRef={mapRef} />
      </MapContainer>

      {parcelLoading && (
        <div className="absolute w-full h-full">
          <PanelLoader />
        </div>
      )}
    </div>
  );
}

function MapComponent(props: any) {
  const {
    parcelSelected,
    max_bounds,
    layers,
    coords,
    currentlySelectedLayerIndex,
    getParcelByCoordinates,
    addNewMarker,
  } = useBafEditorStore();

  const mapRef = props.mapRef;

  const customIcon = L.icon({
    iconUrl: 'marker_icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const handleKeepInBounds = () => {
    if (parcelSelected && max_bounds && mapRef.current) {
      const currentCenter = mapRef.current.getCenter();
      const newCenter = mapRef.current.getCenter();
      const [minX, minY, maxX, maxY] = max_bounds;

      if (currentCenter.lng < minX) {
        newCenter.lng = minX;
      } else if (currentCenter.lng > maxX) {
        newCenter.lng = maxX;
      }

      if (currentCenter.lat < minY) {
        newCenter.lat = minY;
      } else if (currentCenter.lat > maxY) {
        newCenter.lat = maxY;
      }

      if (!currentCenter.equals(newCenter)) {
        mapRef.current.panTo(newCenter);
      }
    }
  };

  function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html

    var x = point[0],
      y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0],
        yi = vs[i][1];
      var xj = vs[j][0],
        yj = vs[j][1];

      var intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  const debouncedKeepInBounds = debounce(handleKeepInBounds, 75);

  const mapEvents = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      if (!parcelSelected) getParcelByCoordinates({ x: lat, y: lng });
      if (currentlySelectedLayerIndex != -1) {
        if (inside([lat, lng], coords)) {
          addNewMarker([lat, lng]);
        } else {
          emitError('Wybrane punkt nie jest w obszarze działki');
        }
      }
    },
    drag: () => {
      debouncedKeepInBounds();
    },
  });

  const map = useMap();

  const tms_options = {
    url: 'https://mapy.geoportal.gov.pl/wss/ext/OSM/BaseMap/tms/1.0.0/osm_3857/GLOBAL_WEBMERCATOR/{z}/{x}/{y}.png',
    tms: true,
    zoomOffset: -1,
    maxZoom: 18,
  };

  const wms_options = {
    layers: 'dzialki,numery_dzialek',
    minZoom: 12,
    maxZoom: 22,
    format: 'image/png',
    transparent: true,
    url: 'https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaEwidencjiGruntow',
  };

  const satelite_options = {
    layers: 'Raster',
    minZoom: 18,
    maxZoom: 22,
    format: 'image/png',
    transparent: false,
    url: 'https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMS/StandardResolution',
  };

  return (
    <>
      <WMSTileLayer {...satelite_options} />
      <TileLayer {...tms_options} />
      <WMSTileLayer {...wms_options} />
      {parcelSelected && coords.length > 0 && (
        <Polygon positions={coords} color="red" fill={false} />
      )}

      {currentlySelectedLayerIndex != -1 &&
        layers[currentlySelectedLayerIndex].polygon.map((coords, index) => {
          return <Marker position={coords} />;
        })}

      {layers.map((layer, index) => {
        return (
          <Polygon
            key={index}
            positions={layer.polygon.map((e) => e)}
            color={layer.color}
          />
        );
      })}
    </>
  );
}

export default Map;
