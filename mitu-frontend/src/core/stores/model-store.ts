import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface InitialModelStore {
  modelUrl: string;
}

const initialModelStore: InitialModelStore = {
  modelUrl: '',
};

export interface ModelStore extends InitialModelStore {
  setModelUrl: (url: string) => void;
  clearModelUrl: () => void;
}

export const useModelStore = create<ModelStore, [['zustand/devtools', never]]>(
  devtools((set, get) => ({
    ...initialModelStore,
    setModelUrl: (url: string) => set(() => ({ modelUrl: url })),
    clearModelUrl: () => set(() => ({ modelUrl: '' })),
  })),
);
