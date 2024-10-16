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
      colors={['#E44044', '#FFFFFF', '#F6D5D4', '#EB919A', '#1B1818']}
    />
  );
}
