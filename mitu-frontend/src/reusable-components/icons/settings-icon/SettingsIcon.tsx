import { MaterialSymbol } from 'react-material-symbols';

export default function SettingsIcon({
  size = 30,
  onClick,
}: {
  size?: number;
  onClick?: () => void;
}) {
  return (
    <MaterialSymbol
      onClick={onClick}
      icon="settings"
      size={size}
      fill
      grade={25}
    />
  );
}
