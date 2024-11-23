import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type Image = {
  src: string;
};

interface InitialGalleryStore {
  images: Image[];
  visible: boolean;
}

const initialGalleryStore: InitialGalleryStore = {
  images: [],
  visible: false,
};

export interface GalleryStore extends InitialGalleryStore {
  openGallery: (images: Image[]) => void;
  closeGallery: () => void;
}

export const useGalleryStore = create<
  GalleryStore,
  // eslint-disable-next-line prettier/prettier
  [['zustand/devtools', never]]
>(
  devtools((set) => ({
    ...initialGalleryStore,
    openGallery: (images) => set({ images, visible: true }),
    closeGallery: () => set({ visible: false }),
  })),
);
