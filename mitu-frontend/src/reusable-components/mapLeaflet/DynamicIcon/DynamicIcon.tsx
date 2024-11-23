import { memo } from 'react';
import { MaterialSymbol } from 'react-material-symbols';
import './DynamicIcon.css';

export const DynamicIconComponent = memo(
  ({ id, color, icon }: { color: string; icon: string; id: string }) => {
    return (
      <div key={id} style={{ borderColor: color, color: color }} className="di">
        <MaterialSymbol icon={icon} color="black" size={20} fill grade={25} />
        <div className="di-shadow"></div>
      </div>
    );
  },
);
