import { MaterialSymbol } from 'react-material-symbols';

export default function SearchIcon({ onClick }: { onClick?: () => void }) {
  return (
    <MaterialSymbol
      onClick={onClick}
      icon="search"
      size={30}
      fill
      grade={25}
      className="text-primary"
    />
  );
}
