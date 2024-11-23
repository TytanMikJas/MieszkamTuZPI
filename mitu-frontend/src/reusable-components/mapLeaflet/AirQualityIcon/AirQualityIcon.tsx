import { memo } from 'react';
import './AirQualityIcon.css';

export const AirQualityIcon = memo(
  ({ id, color }: { color: string; id: string }) => {
    return (
      <div key={id} style={{ backgroundColor: color }} className="aqp"></div>
    );
  },
);
