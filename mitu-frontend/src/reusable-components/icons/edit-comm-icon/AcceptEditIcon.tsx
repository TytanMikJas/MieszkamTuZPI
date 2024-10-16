import { MaterialSymbol } from 'react-material-symbols';

export default function AcceptEditIcon(props: { onClick: () => void }) {
  const { onClick } = props;
  return (
    <div className="flex items-center text-green-700 hover:text-green-500 duration-1 ease-in">
      <MaterialSymbol onClick={onClick} icon="done" size={30} fill grade={25} />
    </div>
  );
}
