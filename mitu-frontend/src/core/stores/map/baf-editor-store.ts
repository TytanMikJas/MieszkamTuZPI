import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import LatLon from 'geodesy/latlon-spherical';
import { axiosInstance } from '@/core/api/axios-instance';
import { SuccessResponse } from '@/core/api/response';
import { emitError } from '@/toast-actions';
import { INDICATORS, SURFACES_WITH_COLORS } from '@/constants';

export type SimpleCoordsObject = {
  x: number;
  y: number;
};

interface InitialBafEditorStore {
  parcelData: any;
  parcelSelected: boolean;
  parcelLoading: boolean;
  editorLoading: boolean;

  coords: [number, number][];
  polygon_center: [number, number];
  max_bounds: [number, number][];
  layers: any[];
  area: number;

  additionModal: boolean;
  infoModal: boolean;
  mapPositionCenter: [number, number];
  indicators: any;
  surfaces: any;
  currentlySelectedLayerIndex: number;
  zoomToCoords: [number, number];
}

export interface BafEditorStore extends InitialBafEditorStore, EditorData {
  getParcelByCoordinates: ({ x, y }: SimpleCoordsObject) => void;
  getParcelShape: ({ x, y }: SimpleCoordsObject) => void;
  getParcelShapeByName: ({
    region,
    number,
  }: {
    region: string;
    number: string;
  }) => void;
  getAddressCoordinates: ({ address }: { address: string }) => void;
  clearParcelData: () => void;
  closeInfoModal: () => void;
  closeAdditionModal: () => void;
  openAdditionModal: () => void;
  addNewLayer: (layer: any) => void;
  addNewMarker: (marker: any) => void;
  completeLayer: () => void;
  removeLayer: (index: number) => void;
  redoMarker: () => void;
}

interface EditorData {
  coords: [number, number][];
  polygon_center: [number, number];
  max_bounds: [number, number][];
  layers: any[];
  area: number;
}

const initialEditorData: EditorData = {
  coords: [],
  polygon_center: [0, 0],
  max_bounds: [],
  layers: [],
  area: 0,
};

const initialBafEditorStore: InitialBafEditorStore = {
  parcelData: {},
  parcelSelected: false,
  parcelLoading: false,
  editorLoading: false,

  ...initialEditorData,

  additionModal: false,
  infoModal: false,
  mapPositionCenter: [
    Number(import.meta.env.VITE_CITY_X) || 0,
    Number(import.meta.env.VITE_CITY_Y) || 0,
  ],
  indicators: { ...INDICATORS },
  surfaces: { ...SURFACES_WITH_COLORS },
  currentlySelectedLayerIndex: -1,
  zoomToCoords: [0, 0],
};

function calculateArea(coordinates: any) {
  const latLons = coordinates.map(([lat, lon]) => new LatLon(lat, lon));

  const areaInSquareMeters = LatLon.areaOf(latLons);

  return areaInSquareMeters;
}

export const useBafEditorStore = create<
  BafEditorStore,
  [['zustand/devtools', never]]
>(
  devtools((set, get) => ({
    ...initialBafEditorStore,
    getParcelByCoordinates: async ({ x, y }) => {
      set({ parcelLoading: true });
      axiosInstance
        .get<SuccessResponse<any>>(
          `/cartography/getParcelByCoordinates?latitude=${y}&longitude=${x}`,
        )
        .then((response) => {
          set({
            parcelData: response.data.data,
            parcelLoading: false,
            infoModal: true,
          });
        })
        .catch(() => {
          set({ parcelLoading: false, parcelData: {} });
        });
    },
    getParcelShape: async ({ x, y }) => {
      set({ editorLoading: true });
      axiosInstance
        .get<SuccessResponse<any>>(
          `/cartography/getParcelShape?latitude=${y}&longitude=${x}`,
        )
        .then((response) => {
          const area = calculateArea(response.data.data.coords);
          set({
            coords: response.data.data.coords,
            polygon_center: response.data.data.polygon_center,
            max_bounds: response.data.data.max_bounds,
            layers: [],
            area,
            editorLoading: false,
            parcelSelected: true,
            infoModal: false,
            zoomToCoords: response.data.data.polygon_center.reverse(),
          });
        })
        .catch(() => {
          set({
            editorLoading: false,
            ...initialEditorData,
            parcelSelected: false,
          });
        });
    },
    getParcelShapeByName: async ({ region, number }) => {
      set({ parcelLoading: true });
      axiosInstance
        .get<SuccessResponse<any>>(
          `/cartography/getParcelShape?parcelRegion=${region}&parcelNumber=${number}`,
        )
        .then((response) => {
          const area = calculateArea(response.data.data.coords);
          set({
            coords: response.data.data.coords,
            polygon_center: response.data.data.polygon_center,
            max_bounds: response.data.data.max_bounds,
            layers: [],
            area,
            parcelData: {
              parcelNumber: response.data.data.parcelNumber,
              parcelRegion: response.data.data.parcelRegion,
            },
            editorLoading: false,
            parcelSelected: true,
            infoModal: false,
            zoomToCoords: response.data.data.polygon_center.reverse(),
          });
        })
        .catch(() => {
          set({
            editorLoading: false,
            ...initialEditorData,
            parcelSelected: false,
          });
        });
    },
    getAddressCoordinates: async ({ address }) => {
      set({ parcelLoading: true });
      axiosInstance
        .get<SuccessResponse<any>>(
          `/cartography/getCoordinatesByAddress?address=${address}`,
        )
        .then((response) => {
          set({ zoomToCoords: [response.data.data.x, response.data.data.y] });
        })
        .catch(() => {
          set({ parcelLoading: false });
        });
    },
    clearParcelData: () =>
      set({
        parcelData: {},
        parcelSelected: false,
        parcelLoading: false,
        infoModal: false,
        ...initialEditorData,
        additionModal: false,
        currentlySelectedLayerIndex: -1,
      }),
    closeInfoModal: () => set({ infoModal: false }),
    closeAdditionModal: () => set({ additionModal: false }),
    openAdditionModal: () => set({ additionModal: true }),
    addNewLayer: (layer) => {
      const { layers } = get();
      set({
        layers: [...layers, layer],
        currentlySelectedLayerIndex: layers.length,
      });
    },

    addNewMarker: (marker) => {
      const { layers, currentlySelectedLayerIndex } = get();
      // state.editorData.layers[state.currentlySelectedLayerIndex].polygon.push(action.payload);
      layers[currentlySelectedLayerIndex].polygon.push(marker);
      set({ layers });
    },

    completeLayer: () => {
      const { layers, currentlySelectedLayerIndex } = get();
      if (layers[currentlySelectedLayerIndex].polygon.length < 3) {
        emitError('Za mało punktów na warstwie');
        return;
      }
      const poly = layers[currentlySelectedLayerIndex].polygon;
      const a = calculateArea([...poly, poly[0]]);
      layers[currentlySelectedLayerIndex].area = parseFloat(a.toFixed(2));
      set({ layers, currentlySelectedLayerIndex: -1 });
    },
    removeLayer: (index) => {
      const { layers } = get();
      set({
        layers: layers.filter((_, i) => i != index),
        currentlySelectedLayerIndex: -1,
      });
    },
    redoMarker: () => {
      const { layers, currentlySelectedLayerIndex } = get();
      layers[currentlySelectedLayerIndex].polygon.pop();
      set({ layers });
    },
  })),
);
