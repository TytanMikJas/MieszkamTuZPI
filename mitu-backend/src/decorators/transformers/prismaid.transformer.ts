import { Transform } from 'class-transformer';

export default function TransformPrismaID() {
  return Transform(({ value }) => Number(value));
}
