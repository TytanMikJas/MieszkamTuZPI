import { Transform } from 'class-transformer';
/**
 * Transformer which transforms a string of comma separated string of badge names into an array of badge names.
 * @returns
 */
export default function BadgeTransform() {
  return Transform(({ value }) => {
    return value.split(',');
  });
}
