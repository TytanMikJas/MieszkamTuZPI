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

export default function IconLoopStandard({
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
  // tutaj sczytuje size
  const [playerSize, setPlayerSize] = useState<number>(screenSize);

  useEffect(() => {
    playerRef.current?.playFromBeginning();
  }, []);

  return (
    <Player
      ref={playerRef}
      icon={icon}
      size={playerSize}
      onComplete={() => playerRef.current?.playFromBeginning()}
    />
  );
}
