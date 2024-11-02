import { Transform } from 'class-transformer';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
import { ERROR_INVALID_LOCATION_TUPLE } from 'src/strings';

/**
 * Validate location tuple
 * @param {string} value
 * @returns {string}
 */
export function validate(value: string): string {
  const parsedValue = value.split(',').map((v) => parseFloat(v));
  if (parsedValue.length !== 2 || parsedValue.some((v) => isNaN(v))) {
    throw new SimpleBadRequest(ERROR_INVALID_LOCATION_TUPLE);
  }
  return value;
}

/**
 * Validator, which validates a string of geo location tuple. Location tuple is a string of
 * two numbers separated by comma ex. 56.123, 56.678
 * @returns
 */
export default function ValidateLocationTuple() {
  return Transform(({ value }) => validate(value));
}
