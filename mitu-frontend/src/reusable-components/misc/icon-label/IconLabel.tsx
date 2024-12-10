import { MaterialSymbol } from 'react-material-symbols';
import VerifiedIcon from '../../icons/verified-icon/VerifiedIcon';

export default function IconLabel({
  text,
  icon,
  size = 30,
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
      <div className="line-clamp-1 ms-1" data-testid="icon-label-text">
        {text}
      </div>
      {verified && <VerifiedIcon />}
    </div>
  );
}
