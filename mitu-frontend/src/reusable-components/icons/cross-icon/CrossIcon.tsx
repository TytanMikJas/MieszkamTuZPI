import { MaterialSymbol } from 'react-material-symbols';

export default function CrossIcon({
  onClick,
  size = 30,
  className,
}: {
  onClick?: () => void;
  size?: number;
  className?: string;
}) {
  return (
    <MaterialSymbol
      onClick={onClick}
      icon="close"
      size={size}
      fill
      grade={25}
      className={className ? className : 'text-primary cursor-pointer'}
    />
  );
}
