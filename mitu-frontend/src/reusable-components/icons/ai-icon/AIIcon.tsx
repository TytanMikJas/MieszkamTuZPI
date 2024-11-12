import { Image } from 'lucide-react';
import React from 'react';

type Props = {
  width: number | string;
  height: number | string;
};

function AiIcon({ width, height }: Props) {
  return (
    <img src="/artificial-intelligence.png" width={width} height={height} />
  );
}

export default AiIcon;
