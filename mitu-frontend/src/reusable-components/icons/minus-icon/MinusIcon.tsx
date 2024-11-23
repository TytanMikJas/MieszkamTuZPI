import { MaterialSymbol } from 'react-material-symbols';

export default function MinusIcon({
  selected,
  onClick,
  className,
}: {
  selected: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div data-testid="minus-icon">
      <MaterialSymbol
        onClick={onClick}
        icon="remove"
        size={30}
        fill
        grade={25}
        className={`text-blue-700 ${selected ? 'bg-blue-200 rounded-full' : ''} ${className}`}
      />
    </div>
  );
}
