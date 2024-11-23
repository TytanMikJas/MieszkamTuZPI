import { useBafEditorStore } from '@/core/stores/map/baf-editor-store';
import CrossIcon from '@/reusable-components/icons/cross-icon/CrossIcon';
import PlusIcon from '@/reusable-components/icons/plus-icon/PlusIcon';

function Layer(props: any) {
  const { currentlySelectedLayerIndex, completeLayer, removeLayer } =
    useBafEditorStore();

  const { surfaceType, color, ownName, area } = props.layer;
  const ownIndex = props.index;

  const handleCompleteLayer = () => {
    completeLayer();
  };

  const handleDeleteLayer = () => {
    removeLayer(ownIndex);
  };

  return (
    <div key={props.index} className="flex">
      <div className="flex flex-col gap-1 w-full justify-center">
        <div className="flex gap-2">
          <div className="w-6 h-full" style={{ backgroundColor: color }}></div>
          <div className="text-black text-base py-2 font-medium">
            {surfaceType}
          </div>
        </div>
        <div className="flex w-full">
          {area && (
            <div className="py-1 px-2 font-medium bg-primary text-white w-full">
              {area} m<sup>2</sup>
            </div>
          )}
          {ownName != '' && (
            <div className="py-1 px-2 font-medium bg-white text-black border-2 border-gray-200 w-full">
              {ownName}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center flex-col items-center gap-4">
        {ownIndex == currentlySelectedLayerIndex && (
          <PlusIcon onClick={handleCompleteLayer} />
        )}
        <CrossIcon onClick={handleDeleteLayer} />
      </div>
    </div>
  );
}

export default Layer;
