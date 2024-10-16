import { AsyncImage } from 'loadable-image';
import Loader from 'src/reusable-components/loaders/Loader';
import { MaterialSymbol } from 'react-material-symbols';

export default function LoadableImage({
  src,
  height,
  width,
  style,
  className,
  onClick,
}: {
  src: string;
  height?: string;
  width?: string;
  style?: any;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden ${className} ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      style={{ height: height, width: width }}
    >
      <AsyncImage
        src={src}
        style={{ ...style }}
        loader={
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <Loader />
          </div>
        }
        error={
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <MaterialSymbol
              icon="error"
              size={50}
              fill
              grade={-25}
              color="text-primary"
            />
          </div>
        }
      />
      ;
    </div>
  );
}
