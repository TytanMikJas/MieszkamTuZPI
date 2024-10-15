import { ScrollArea } from '@/shadcn/scroll-area';
import NamedOutlet from '@/core/routing/named-outlet/NamedOutlet';
import useNamedOutlet from '@/core/routing/named-outlet/useNamedOutlet';
import { useNavigate } from 'react-router-dom';
import NotFound from '@/reusable-components/not-found/NotFound';
import NamedEffectOutlet from '@/core/routing/named-outlet/NamedEffectOutlet';
import PhoneLayout from '@/reusable-components/app-layout/PhoneLayout';
import { MaterialSymbol } from 'react-material-symbols';
import { LeftPanelState, useUiStore } from '@/core/stores/ui-store';

const MapWithSidepanelsLayout = () => {
  const leftOutlet = useNamedOutlet({ name: 'left' });
  const isLeftContentPresent = !!leftOutlet.outlet;
  const leftPanelState = useUiStore((state: any) => state.leftPanelState);
  const isRightContentPresent = leftPanelState === LeftPanelState.LEFT_AND_RIGHT;
  const leftPanelWidth = 'w-[32vw]';
  const rightPanelWidth = isRightContentPresent ? 'w-[30vw]' : 'w-[0]';
  return (
    <>
      <NamedEffectOutlet />
      <div className="h-full *:inline-block">
        <div className={` h-full overflow-hidden   ${leftPanelWidth}`}>
          <div className="w-full h-full scrollable-vertical">
            {isLeftContentPresent && <NamedOutlet name="left" />}
            {!isLeftContentPresent && <NotFound />}
          </div>
        </div>
        <div className={`h-full ${rightPanelWidth} scrollable-vertical`}>
          <NamedOutlet name="right" />
        </div>
      </div>
    </>
  );
};
  

export default MapWithSidepanelsLayout;
