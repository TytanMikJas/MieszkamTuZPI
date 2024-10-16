import { MaterialSymbol } from 'react-material-symbols';

export default function EditCommentIcon(props: { onClick: () => void }) {
  const { onClick } = props;
  return (
    <div className="flex items-center text-gray-700 hover:text-gray-500 duration-1 ease-in">
      <MaterialSymbol onClick={onClick} icon="edit" size={30} fill grade={25} />
    </div>
  );
}
