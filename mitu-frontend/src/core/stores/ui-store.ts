import { RIGHTBAR_STAGE_MAP } from '@/strings';
import { RightbarStage } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface InitialUiStore {
  rightbarStage: RightbarStage;
  leftPanelState: LeftPanelState;
  currentBottomSheetSnap: PhoneLayoutSnap;
}

export enum PhoneLayoutSnap {
  BOTTOM = 2,
  MIDDLE = 1,
  TOP = 0,
}

export enum LeftPanelState {
  ONLY_LEFT = 'ONLY_LEFT',
  LEFT_AND_RIGHT = 'LEFT_AND_RIGHT',
  ALL_HIDDEN = 'ALL_HIDDEN',
}

const initialUiStore: InitialUiStore = {
  leftPanelState: LeftPanelState.ONLY_LEFT,
  rightbarStage: RIGHTBAR_STAGE_MAP,
  currentBottomSheetSnap: PhoneLayoutSnap.TOP,
};

export interface UiStore extends InitialUiStore {
  openBothPanels: () => void;
  openOnlyLeftPanel: () => void;
  closeBothPanels: () => void;
  setRightbarStage: (
    rightbarStage: RightbarStage,
    followUp?: () => void,
  ) => void;
  setCurrentBottomSheetSnap: (snap: PhoneLayoutSnap) => void;
}

export const useUiStore = create<UiStore, [['zustand/devtools', never]]>(
  devtools((set) => ({
    openBothPanels: () => {
      set({ leftPanelState: LeftPanelState.LEFT_AND_RIGHT });
    },
    openOnlyLeftPanel: () => {
      set({ leftPanelState: LeftPanelState.ONLY_LEFT });
    },
    closeBothPanels: () => {
      set({ leftPanelState: LeftPanelState.ALL_HIDDEN });
    },
    setCurrentBottomSheetSnap: (currentBottomSheetSnap: PhoneLayoutSnap) => {
      set({ currentBottomSheetSnap });
    },
    setRightbarStage: (rightbarStage, followUp) => {
      set({ rightbarStage });
      if (followUp) followUp();
    },
    ...initialUiStore,
  })),
);
