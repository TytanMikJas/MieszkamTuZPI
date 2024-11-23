import { MaterialSymbol } from 'react-material-symbols';

export default function MapIcon(props: { onClick?: () => void }) {
  const { onClick } = props;
  return (
    <MaterialSymbol onClick={onClick} icon="map" size={30} fill grade={25} />
  );
}
