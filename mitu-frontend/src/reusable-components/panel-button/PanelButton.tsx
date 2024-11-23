import { MaterialSymbol } from 'react-material-symbols';

export default function PanelButton({
  text,
  icon,
  onClick,
}: {
  text: string;
  icon: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`cursor-pointer active:bg-gray-200 hover:bg-gray-100 ease-in duration-100 rounded-lg shadow p-5 flex flex-col justify-center items-center gap-2`}
      onClick={onClick}
    >
      <MaterialSymbol
        icon={icon}
        size={30}
        fill
        grade={25}
        className="text-primary cursor-pointer"
      />
      <div className="font-medium">{text}</div>
    </div>
  );
}
