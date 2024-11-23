import { MaterialSymbol } from 'react-material-symbols';

export default function MailIcon({
  size = 30,
  onClick,
}: {
  size?: number;
  onClick?: () => void;
}) {
  return (
    <MaterialSymbol onClick={onClick} icon="mail" size={size} fill grade={25} />
  );
}
