import { useUiStore } from '@/core/stores/ui-store';
import {
  RIGHTBAR_STAGE_AREA,
  RIGHTBAR_STAGE_MAP,
  RIGHTBAR_STAGE_MODEL,
} from '@/strings';
import ModelPreview from '../model-preview/ModelPreview';
import { MoveBottomSheetDown } from '../effects/BottomSheetPositionEffect';
import MapWithPosts from '../mapLeaflet/mapWithPosts/MapWithPosts';
import MapEditable from '../mapLeaflet/mapEditable/MapEditable';

export default function Stager() {
  const { rightbarStage } = useUiStore();

  const map = <MapWithPosts />;

  switch (rightbarStage) {
    case RIGHTBAR_STAGE_MAP:
      return map;
    case RIGHTBAR_STAGE_AREA:
      return <MapEditable />;
    case RIGHTBAR_STAGE_MODEL:
      return (
        <>
          <ModelPreview />
          <MoveBottomSheetDown />
        </>
      );
    default:
      return map;
  }
}
