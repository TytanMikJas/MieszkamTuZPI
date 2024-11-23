import { MaterialSymbol } from 'react-material-symbols';

export default function CancelEditIcon(props: { onClick: () => void }) {
  const { onClick } = props;
  return (
    <div className="flex items-center text-red-700 hover:text-red-500 duration-1 ease-in">
      <MaterialSymbol
        onClick={onClick}
        icon="close"
        size={30}
        fill
        grade={25}
      />
    </div>
  );
}
