import { PuffLoader } from 'react-spinners';
import { MIESZKAMTU_BLUE } from '../../constants';

export default function PulseLoader({ size }: { size?: number }) {
  return <PuffLoader size={size} loading={true} color={MIESZKAMTU_BLUE} />;
}
