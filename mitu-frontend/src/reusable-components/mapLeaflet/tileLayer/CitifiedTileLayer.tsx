import { TileLayer } from 'react-leaflet';

export default function CitifiedTileLayer() {
  return (
    <TileLayer
      attribution='<a href="https://www.openstreetmap.org/copyright">OSM</a>'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      maxZoom={21}
      maxNativeZoom={19}
      detectRetina={true}
    />
  );
}
