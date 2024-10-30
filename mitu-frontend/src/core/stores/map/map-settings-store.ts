import { LatLng } from 'leaflet';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MAP_INIT_ZOOM } from '../../../constants';

export interface MapSettingsStore {
  zoom: number;
  setZoom: (zoom: number) => void;

  center: LatLng;
  setCenter: (center: LatLng) => void;

  forcedCenter: boolean;
  setCenterWithForce: (center: LatLng) => void;
  clearForceFlag: () => void;
}

export const useMapSettingsStore = create<
  MapSettingsStore,
  [['zustand/devtools', never]]
>(
  devtools((set, get) => ({
    zoom: MAP_INIT_ZOOM,
    setZoom: (zoom: number) => set({ zoom }),

    center: new LatLng(
      import.meta.env.VITE_CITY_X,
      parseFloat(import.meta.env.VITE_CITY_Y),
    ),
    setCenter: (center: LatLng) => set({ center }),

    forcedCenter: false,
    setCenterWithForce: (center: LatLng) => set({ center, forcedCenter: true }),
    clearForceFlag: () => set({ forcedCenter: false }),
  })),
);
