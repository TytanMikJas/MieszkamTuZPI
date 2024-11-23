import { MaterialSymbol } from 'react-material-symbols';

export default function EditIcon(props: { onClick?: () => void }) {
  const { onClick } = props;
  return (
    <MaterialSymbol onClick={onClick} icon="edit" size={30} fill grade={25} />
  );
}
