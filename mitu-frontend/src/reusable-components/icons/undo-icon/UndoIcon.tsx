import { MaterialSymbol } from 'react-material-symbols';

export default function UndoIcon({ onClick }: { onClick?: () => void }) {
  return (
    <MaterialSymbol
      onClick={onClick}
      icon="undo"
      size={30}
      fill
      grade={25}
      className="text-primary"
    />
  );
}
