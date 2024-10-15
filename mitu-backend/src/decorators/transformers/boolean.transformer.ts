import { Transform } from 'class-transformer';
/**
 * Transformer which transforms string 'true' or 'false' into a boolean.
 * @returns
 */
export default function TransformBoolean() {
  return Transform(({ value }) => {
    return value.toLowerCase() === 'true';
  });
}
