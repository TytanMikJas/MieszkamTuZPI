import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export type Image = {
  src: string;
};

export default function ImageCarousel({ images }: { images: Image[] }) {
  if (images.length == 0) return <></>;
  return (
    <div
      className={
        'w-auto h-[400px] flex flex-row overflow-x-scroll ml-4 mr-5 my-3 scrollbar-track-secondary'
      }
    >
      <PhotoProvider loop={true}>
        {images.map((item, index) => (
          <PhotoView key={index} src={item.src}>
            <img src={item.src} alt="" className={'mx-1'} />
          </PhotoView>
        ))}
      </PhotoProvider>
    </div>
  );
}
