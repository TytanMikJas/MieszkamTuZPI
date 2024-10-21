import { useOutlet } from 'react-router-dom';

export default function useNamedRouteEffect(): JSX.Element | null {
  const outlet = useOutlet();
  const effect = outlet?.props?.children?.props?.children?.props?.effect;
  if (effect) {
    return effect;
  }
  return null;
}
