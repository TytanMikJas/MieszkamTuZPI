import { MaterialSymbol } from 'react-material-symbols';

export default function DeleteIcon(props: { onClick?: () => void }) {
  const { onClick } = props;
  return (
    <MaterialSymbol onClick={onClick} icon="delete" size={30} fill grade={25} />
  );
}
