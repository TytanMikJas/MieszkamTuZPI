import { Image, useGalleryStore } from '@/core/stores/gallery-store';
import { useEffect, useState } from 'react';
import { PhotoSlider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export default function ImageGallery() {
  const [index, setIndex] = useState(0);

  const { images, visible, closeGallery } = useGalleryStore();

  useEffect(() => {
    return () => {
      setIndex(0);
      closeGallery();
    };
  }, []);

  return (
    <PhotoSlider
      loop={true}
      images={images.map((item: Image, index: number) => ({
        src: item.src,
        key: index,
      }))}
      visible={visible}
      onClose={closeGallery}
      index={index}
      onIndexChange={setIndex}
    />
  );
}
