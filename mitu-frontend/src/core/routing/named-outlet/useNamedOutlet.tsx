import { useOutlet } from 'react-router-dom';

type UseNamedOutletProps = {
  name: string;
};

export default function useNamedOutlet({ name }: UseNamedOutletProps): {
  outlet: { name: string; content: JSX.Element } | null;
} {
  const outlet = useOutlet();

  if (!outlet) {
    console.error(
      'useNamedOutlet must be used inside a Router component which receives a named outlet.',
    );
    return {
      outlet: null,
    };
  }
  const children =
    outlet?.props?.children?.props?.children?.props?.outlets?.filter(
      (outlet: { name: string; content: JSX.Element }) => outlet.name === name,
    );

  if (!children) {
    return {
      outlet: null,
    };
  }

  if (!children[0]) {
    return {
      outlet: null,
    };
  }
  return {
    outlet: children[0],
  };
}
