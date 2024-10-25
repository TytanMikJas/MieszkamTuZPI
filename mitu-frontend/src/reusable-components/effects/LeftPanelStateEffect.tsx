import { LeftPanelState, useUiStore } from '@/core/stores/ui-store';
import React, { useEffect, useLayoutEffect } from 'react';

export function OpenOnlyLeftPanel() {
  const uiStore = useUiStore();
  useLayoutEffect(() => {
    uiStore.openOnlyLeftPanel();
  }, []);
  return null;
}

export function OpenBothPanels() {
  const uiStore = useUiStore();
  useLayoutEffect(() => {
    uiStore.openBothPanels();
  }, []);
  return null;
}

export function CloseBothPanels() {
  const uiStore = useUiStore();
  useLayoutEffect(() => {
    uiStore.closeBothPanels();
  }, []);
  return null;
}
