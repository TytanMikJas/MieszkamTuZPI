import useNamedRouteEffect from './useNamedRouteEffect';
import React from 'react';

export default function NamedEffectOutlet() {
  const effect = useNamedRouteEffect();

  if (effect) {
    return (
      <React.Fragment key={effect.key ?? Math.random()}>
        {effect}
      </React.Fragment>
    );
  }
  return null;
}
