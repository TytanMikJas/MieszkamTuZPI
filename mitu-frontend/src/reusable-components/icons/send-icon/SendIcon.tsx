import { MaterialSymbol } from 'react-material-symbols';

export default function SendIcon({ onClick }: { onClick?: () => void }) {
  return (
    <MaterialSymbol
      onClick={onClick}
      icon="send"
      size={30}
      fill
      grade={25}
      className="text-primary cursor-pointer"
    />
  );
}
