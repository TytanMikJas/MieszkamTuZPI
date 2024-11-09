import { MaterialSymbol } from 'react-material-symbols';

export default function PlusIcon({
  selected,
  onClick,
  className,
}: {
  selected: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div data-testid="plus-icon">
      <MaterialSymbol
        onClick={onClick}
        icon="add"
        size={30}
        fill
        color="red"
        grade={25}
        className={`text-primary ${selected ? 'bg-red-200 rounded-full' : ''} ${className}`}
      />
    </div>
  );
}
