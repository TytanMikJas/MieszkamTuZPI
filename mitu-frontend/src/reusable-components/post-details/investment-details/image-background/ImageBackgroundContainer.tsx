import { ReactNodeArray } from 'prop-types';
import LoadableImage from '../../../misc/lazy-loaded-image/LoadableImage';

export default function ImageBackgroundContainer(props: {
  children: ReactNodeArray;
  url: string;
}) {
  const { children, url } = props;
  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="absolute w-full h-full bg-black blur-[4px]">
        <LoadableImage
          src={url}
          height="100%"
          width="100%"
          style={{ opacity: '50%' }}
        />
      </div>

      <div
        className="flex flex-col relative p-4 text-white"
        style={{ zIndex: 2 }}
      >
        {children}
      </div>
    </div>
  );
}
