import { Player } from '@lordicon/react';
import { useEffect, useRef, useState } from 'react';
import { SCREEN_SM, SCREEN_LG } from '../../constants';

type IconLoopStandardProps = {
  icon: object;
  sizes: {
    sm: number;
    md: number;
    lg: number;
  }; // size for [sm screen, between md and lg, lg and bigger screen]
};

export default function IconPlayOnClick({
  icon,
  sizes,
}: IconLoopStandardProps) {
  const screenWidth = window.innerWidth;
  let screenSize =
    screenWidth < SCREEN_SM
      ? sizes.sm
      : screenWidth < SCREEN_LG
        ? sizes.md
        : sizes.lg;

  const playerRef = useRef<Player>(null);
  const [playerSize, setPlayerSize] = useState<number>(screenSize);
  const [direction, setDirection] = useState<1 | -1>(-1);

  useEffect(() => {
    playerRef.current?.play();
  }, [direction]);

  const onIconClick = () => {
    setDirection(direction === 1 ? -1 : 1);
  };

  return (
    <div onClick={onIconClick} className="cursor-pointer inline-block">
      <Player
        ref={playerRef}
        size={playerSize}
        icon={icon}
        direction={direction}
        state="morph-unlocked"
      />
    </div>
  );
}
