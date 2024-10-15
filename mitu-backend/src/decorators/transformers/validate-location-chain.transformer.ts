import { Transform } from 'class-transformer';
import { validate as validateLocationTuple } from './validate-location-tuple.transformer';

function validate(value: string) {
  const locationChain = value.split(';');
  locationChain.forEach((locationTuple) => {
    validateLocationTuple(locationTuple);
  });
  return value;
}
/**
 * Validator, which validates a string of geo location chain. Location chain is a string of
 * location tuples separated by semicolon ex. 56.123, 56.678; 56.163, 56.679; 56.123, 56.678
 * @returns
 */
export function ValidateLocationChain() {
  return Transform(({ value }) => validate(value));
}
