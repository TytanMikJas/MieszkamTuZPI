import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import Sheet, { SheetRef } from 'react-modal-sheet';
import { PhoneLayoutSnap, useUiStore } from '@/core/stores/ui-store';
import IconButton from '@/reusable-components/IconButton';

type Props = {
  leftComponent: ReactElement;
  rightComponent?: ReactElement;
  leftButtonText?: string;
  leftButtonIcon?: ReactElement;
  rightButtonText?: string;
  rightButtonIcon?: ReactElement;
  leftButtonAction?: () => void;
  rightButtonAction?: () => void;
  showButtons: boolean;
};

export enum PhoneLayoutPage {
  LEFT,
  RIGHT,
}
/* 
  Total hours spent on this component: 13hours 30 minutes. Please trust me that it works and spend your spare time somewhere else.
  If you have any questions about this component, please contact me at:
  Email:
    - wiktorstankiewicz24@gmail.com
*/
function PhoneLayout({
  leftComponent: leftScreenComponent,
  rightComponent: rightScreenComponent,
  leftButtonText,
  leftButtonIcon,
  rightButtonText,
  rightButtonIcon,
  leftButtonAction,
  rightButtonAction,
  showButtons,
}: Props) {
  const uiStore = useUiStore();
  const sheetRef = useRef<SheetRef>();
  const { setPhoneLayoutPage: setPage, phoneLayoutPage: page } = useUiStore();
  const [isInitialSnap, setIsInitialSnap] = useState(true);
  const buttonsVisible =
    showButtons && uiStore.currentBottomSheetSnap !== PhoneLayoutSnap.BOTTOM;
  useEffect(() => {
    const html = document.querySelector('html');
    const body = document.querySelector('body');
    html?.style.setProperty('overscroll-behavior', 'none');
    body?.style.setProperty('overscroll-behavior', 'none');
    return () => {
      html?.style.setProperty('overscroll-behavior', 'auto');
      body?.style.setProperty('overscroll-behavior', 'auto');
    };
  }, []);

  useEffect(() => {
    if (isInitialSnap) {
      setIsInitialSnap(false);
      return;
    }
    sheetRef.current?.snapTo(uiStore.currentBottomSheetSnap);
  }, [uiStore.currentBottomSheetSnap, isInitialSnap]);

  const onClose = useCallback(() => {
    setTimeout(() => {
      uiStore.setCurrentBottomSheetSnap(PhoneLayoutSnap.BOTTOM);
    }, 50);
  }, []);

  const onSnap = useCallback(
    (snap: number) => {
      if (isInitialSnap) {
        setIsInitialSnap(false);
        return;
      }
      uiStore.setCurrentBottomSheetSnap(snap as PhoneLayoutSnap);
    },
    [isInitialSnap],
  );

  const onLeftButtonClick = useCallback(() => {
    if (leftButtonAction) {
      leftButtonAction();
    }
    setPage(PhoneLayoutPage.LEFT);
  }, [leftButtonAction]);

  const onRightButtonClick = useCallback(() => {
    if (rightButtonAction) {
      rightButtonAction();
    }
    setPage(PhoneLayoutPage.RIGHT);
  }, [rightButtonAction]);

  return (
    <>
      <Sheet
        isOpen
        onClose={onClose}
        onSnap={onSnap}
        snapPoints={[0.92, 0.5, 0.08]}
        ref={sheetRef}
        initialSnap={PhoneLayoutSnap.BOTTOM}
        className="z-[10]"
      >
        <Sheet.Container>
          <div className="flex flex-col">
            <Sheet.Header />
            <div
              className="flex w-full justify-center *:flex-1 *:h-full flex-row w-full *:rounded-none h-[40px]"
              style={{ display: buttonsVisible ? 'initial' : 'none' }}
            >
              <IconButton
                text={
                  page === PhoneLayoutPage.LEFT
                    ? rightButtonText
                    : leftButtonText
                }
                icon={
                  page === PhoneLayoutPage.LEFT
                    ? rightButtonIcon
                    : leftButtonIcon
                }
                buttonType={{ variant: 'default', size: 'default' }}
                className="w-full"
                onClick={
                  page === PhoneLayoutPage.LEFT
                    ? onRightButtonClick
                    : onLeftButtonClick
                }
              />
            </div>
          </div>

          <Sheet.Content>
            {page == PhoneLayoutPage.LEFT ? (
              <Sheet.Scroller id="left">{leftScreenComponent}</Sheet.Scroller>
            ) : (
              <Sheet.Scroller id="right">{rightScreenComponent}</Sheet.Scroller>
            )}
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </>
  );
}

export default PhoneLayout;
