import { Transform } from 'class-transformer';

/**
 * Validate address
 * @returns {Function}
 */
export default function ValidateAddress() {
  return Transform(({ value }) => value);
}
