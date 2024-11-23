import { ECO_GREEN_COLOR } from '@/constants';
import { useMapWithPostsStore } from '@/core/stores/map/map-with-posts-store';
import { Switch } from '@/shadcn/switch';
import { MaterialSymbol } from 'react-material-symbols';

export default function AirQualityToggle() {
  const { airQualityVisible, toggleAirQualityVisibility } =
    useMapWithPostsStore();
  return (
    <div className="absolute z-[1000] right-2 md:right-8 top-4 flex flex-col gap-2 items-end w-min">
      <div className="rounded-xl shadow-md bg-white px-4 py-1 gap-2 flex items-center justify-center">
        <Switch
          checked={airQualityVisible}
          onCheckedChange={toggleAirQualityVisibility}
        />
        <MaterialSymbol
          className="pb-1"
          icon={'eco'}
          color={ECO_GREEN_COLOR}
          size={32}
          fill
          grade={25}
        />
      </div>
    </div>
  );
}
