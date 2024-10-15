import { Transform } from 'class-transformer';

export default function TransformBoolean() {
  return Transform(({ value }) => {
    return value.toLowerCase() === 'true';
  });
}
