import { MaterialSymbol } from 'react-material-symbols';

export default function AttachIcon({ onClick }: { onClick?: () => void }) {
  return (
    <MaterialSymbol
      onClick={onClick}
      icon="attach_file"
      size={30}
      fill
      grade={25}
      className="text-primary cursor-pointer"
    />
  );
}
