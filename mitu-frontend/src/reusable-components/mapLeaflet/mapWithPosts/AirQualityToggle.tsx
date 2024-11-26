import { ECO_GREEN_COLOR } from '@/constants';
import { useMapWithPostsStore } from '@/core/stores/map/map-with-posts-store';
import { Switch } from '@/shadcn/switch';
import { MaterialSymbol } from 'react-material-symbols';

export default function AirQualityToggle() {
  const { airQualityVisible, toggleAirQualityVisibility } =
    useMapWithPostsStore();
  return (
    <div className="absolute z-[1000] right-2 md:right-8 top-4 flex flex-col gap-2 items-end w-min">
      <div className="rounded-xl shadow-md bg-white px-8 py-1 gap-2 flex items-center justify-center">
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
      {airQualityVisible && (
        <div className="w-full bg-white h-full rounded-xl shadow-md">
          <div className="text-xs bg-primary font-bold text-white w-full rounded-xl flex items-center justify-center p-1 mb-0.5">
            JAKOŚĆ POWIETRZA
          </div>
          <div className="px-2 py-2 flex flex-row justify-between h-full">
            <div className="flex flex-col justify-between h-auto italic">
              <span>bardzo dobra</span>
              <span>dobra</span>
              <span>średnia</span>
              <span>zła</span>
            </div>
            <div
              className="w-4 h-32 rounded-xl"
              style={{
                background:
                  'linear-gradient(to bottom, #409900 0%, #00ff00 25%, #ffff00 50%, #ff0000 100%)',
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
