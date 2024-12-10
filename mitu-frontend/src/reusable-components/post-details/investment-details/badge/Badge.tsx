import { MaterialSymbol } from 'react-material-symbols';
import { getContrastColor } from '../../../../utils';

export default function Badge({
  iconName,
  text,
  primaryColor,
  backgroundColor,
}: {
  iconName: string;
  text: string;
  primaryColor: string;
  backgroundColor: string;
}) {
  const textColor = getContrastColor(backgroundColor);
  return (
    <div
      className="flex flex-row items-center overflow-hidden rounded-lg"
      style={{ backgroundColor: backgroundColor }}
    >
      <div
        className="flex flex-row items-center overflow-hidden rounded-lg p-1"
        style={{ backgroundColor: primaryColor }}
      >
        <MaterialSymbol
          icon={iconName}
          size={20}
          fill
          grade={-25}
          color={backgroundColor}
        />
      </div>
      <div className="px-2 text-sm" style={{ color: textColor }}>
        {text}
      </div>
    </div>
  );
}
