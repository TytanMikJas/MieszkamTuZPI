import { MaterialSymbol } from 'react-material-symbols';

export default function GalleryIcon(props: { onClick?: () => void }) {
  const { onClick } = props;
  return (
    <MaterialSymbol
      onClick={onClick}
      icon="gallery_thumbnail"
      size={30}
      fill
      grade={25}
    />
  );
}
