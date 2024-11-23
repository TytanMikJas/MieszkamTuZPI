import A from 'boring-avatars';

export default function Avatar(props: {
  src: string;
  alt: string;
  size?: number;
}) {
  const { src, alt, size = 40 } = props;
  return (
    <A
      size={size}
      name={!src ? 'default' : src}
      variant="beam"
      colors={['#2B6CB0', '#FFFFFF', '#DBEAFE', '#BFDBFF', '#1B1818']}
    />
  );
}
