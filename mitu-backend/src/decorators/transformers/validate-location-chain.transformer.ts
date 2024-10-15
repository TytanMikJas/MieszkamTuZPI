import { Transform } from 'class-transformer';
import { validate as validateLocationTuple } from './validate-location-tuple.transformer';

function validate(value: string) {
  const locationChain = value.split(';');
  locationChain.forEach((locationTuple) => {
    validateLocationTuple(locationTuple);
  });
  return value;
}

export function ValidateLocationChain() {
  return Transform(({ value }) => validate(value));
}
