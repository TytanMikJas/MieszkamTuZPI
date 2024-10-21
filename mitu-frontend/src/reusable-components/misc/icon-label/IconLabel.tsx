import { MaterialSymbol } from 'react-material-symbols';
import VerifiedIcon from '../../icons/verified-icon/VerifiedIcon';

export default function IconLabel({
  text,
  icon,
  size = 36,
  verified = false,
}: {
  text: string;
  icon: string;
  size?: number;
  verified?: boolean;
}) {
  return (
    <div className="flex flex-row items-center gap-1">
      <MaterialSymbol
        icon={icon}
        size={size}
        fill
        grade={-25}
        color="textdark"
      />
      <div className="line-clamp-1">{text}</div>
      {verified && <VerifiedIcon />}
    </div>
  );
}
