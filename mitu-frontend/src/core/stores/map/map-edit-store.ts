import {
  MAP_CMD_EDIT_AREA,
  MAP_CMD_EDIT_LOCATION,
  MAP_CMD_EDIT_OFF,
} from '@/strings';
import { emitError } from '@/toast-actions';
import { LatLng } from 'leaflet';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type EditState =
  | typeof MAP_CMD_EDIT_AREA
  | typeof MAP_CMD_EDIT_LOCATION
  | typeof MAP_CMD_EDIT_OFF;

interface InitialMapEditStore {
  location: LatLng;
  area: LatLng[];
  editState: EditState;
}

export interface MapEditStore extends InitialMapEditStore {
  setLocation: (location: LatLng) => void;
  addPointToArea: (newPoint: LatLng) => void;
  setArea: (areaString: string) => void;
  dropPointFromArea: () => void;
  updatePointInArea: (index: number, newPoint: LatLng) => void;
  resetArea: () => void;
  resetLocation: () => void;
  setEditState: (editState: EditState) => void;
  resetEditStoreState: () => void;
  getParsedArea: (emit: boolean) => string | null;
  getParsedLocation: () => [number, number] | null;
}

const initialMapEditStore: InitialMapEditStore = {
  location: new LatLng(0, 0),
  area: [],
  editState: MAP_CMD_EDIT_OFF,
};

export const useMapEditStore = create<
  MapEditStore,
  // eslint-disable-next-line prettier/prettier
  [['zustand/devtools', never]]
>(
  devtools((set, get) => ({
    ...initialMapEditStore,
    setLocation: (location: LatLng) => set({ location }),
    addPointToArea: (newPoint: LatLng) => {
      const { area } = get();
      set({ area: [...area, newPoint] });
    },
    updatePointInArea: (index: number, newPoint: LatLng) => {
      const { area } = get();
      area[index] = newPoint;
      set({ area });
    },
    dropPointFromArea: () => {
      const { area } = get();
      area.pop();
      set({ area });
    },
    setArea: (areaString: string) => {
      const area = areaString.split(';').map((point) => {
        const [lat, lng] = point.split(',').map((coord) => parseFloat(coord));
        return new LatLng(lat, lng);
      });
      set({ area });
    },
    resetArea: () => set({ area: [] }),
    resetLocation: () => set({ location: initialMapEditStore.location }),
    resetEditStoreState: () => set(initialMapEditStore),
    setEditState: (editState: EditState) => {
      const { area } = get();
      if (editState === MAP_CMD_EDIT_LOCATION && area.length > 1) {
        const firstPoint = area[0] as LatLng;
        const midPoint = area[Math.floor(area.length / 2)] as LatLng;
        set({
          editState,
          location: new LatLng(
            (firstPoint.lat + midPoint.lat) / 2,
            (firstPoint.lng + midPoint.lng) / 2,
          ),
        });
      } else set({ editState });
    },
    getParsedArea: (emit: boolean = true) => {
      const { area } = get();

      if (area.length == 0 && emit) {
        emitError('Brak wybranego obszaru');
        return null;
      }

      if (area.length < 3 && emit) {
        emitError('Wybrano niepoprawny obszar');
        return null;
      }

      return area.map((point) => [point.lat, point.lng].join(',')).join(';');
    },
    getParsedLocation: () => {
      const { location } = get();
      if (location.lat === 0 && location.lng === 0) {
        emitError('Brak wybranej lokalizacji');
        return null;
      }
      return [location.lat, location.lng];
    },
  })),
);
