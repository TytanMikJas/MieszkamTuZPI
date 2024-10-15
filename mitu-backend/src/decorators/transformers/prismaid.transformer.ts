import { Transform } from 'class-transformer';
/**
 * Transformer, which transforms a string of Prisma ID into a number.
 * @returns
 */
export default function TransformPrismaID() {
  return Transform(({ value }) => Number(value));
}
