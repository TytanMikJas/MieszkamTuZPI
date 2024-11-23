import { MaterialSymbol } from 'react-material-symbols';

export default function ModelIcon(props: { onClick?: () => void }) {
  const { onClick } = props;
  return (
    <MaterialSymbol
      onClick={onClick}
      icon="deployed_code"
      size={30}
      fill
      grade={25}
    />
  );
}
