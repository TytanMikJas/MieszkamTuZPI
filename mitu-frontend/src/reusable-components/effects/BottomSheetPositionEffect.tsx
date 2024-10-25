import { PhoneLayoutSnap, useUiStore } from '@/core/stores/ui-store';
import React, { useEffect } from 'react';

type Props = {
  bottomSheetPosition: PhoneLayoutSnap;
};

function BottomSheetPositionEffect({ bottomSheetPosition }: Props) {
  const uiStore = useUiStore();
  useEffect(() => {
    uiStore.setCurrentBottomSheetSnap(bottomSheetPosition);
  }, []);
  return null;
}

export function MoveBottomSheetDown() {
  return (
    <BottomSheetPositionEffect bottomSheetPosition={PhoneLayoutSnap.BOTTOM} />
  );
}

export function MoveBottomSheetMiddle() {
  return (
    <BottomSheetPositionEffect bottomSheetPosition={PhoneLayoutSnap.MIDDLE} />
  );
}
export function MoveBottomSheetUp() {
  return (
    <BottomSheetPositionEffect bottomSheetPosition={PhoneLayoutSnap.TOP} />
  );
}
