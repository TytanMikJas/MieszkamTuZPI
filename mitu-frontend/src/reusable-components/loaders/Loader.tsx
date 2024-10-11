import { ScaleLoader } from 'react-spinners';
import { MIESZKAMTU_BLUE } from '../../constants';

export default function Loader({
  height,
  width,
}: {
  height?: number;
  width?: number;
}) {
  return (
    <ScaleLoader
      height={height}
      width={width}
      loading={true}
      color={MIESZKAMTU_BLUE}
    />
  );
}
