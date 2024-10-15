import { Transform } from 'class-transformer';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
import { ERROR_INVALID_LOCATION_TUPLE } from 'src/strings';

export function validate(value: string) {
  const parsedValue = value.split(',').map((v) => parseFloat(v));
  if (parsedValue.length !== 2 || parsedValue.some((v) => isNaN(v))) {
    throw new SimpleBadRequest(ERROR_INVALID_LOCATION_TUPLE);
  }
  return value;
}

export default function ValidateLocationTuple() {
  return Transform(({ value }) => validate(value));
}
