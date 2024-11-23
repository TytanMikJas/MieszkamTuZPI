import useNamedOutlet from './useNamedOutlet';

type NamedOutletProps = {
  name: string;
};
export default function NamedOutlet({ name }: NamedOutletProps) {
  const { outlet } = useNamedOutlet({ name });
  if (!outlet) {
    return null;
  }
  return outlet.content;
}
