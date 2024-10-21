import { Transform } from 'class-transformer';

export default function ValidateAddress() {
  return Transform(({ value }) => value);
}
