import { HttpStatus } from '@nestjs/common';
import { InvalidInputException } from 'src/exceptions/invalid-input.exception';

/**
 * Invalid credentials exception
 * @export
 * @class InvalidCredentialsException
 * @extends {InvalidInputException}
 */
export default class InvalidCredentialsException extends InvalidInputException {
  constructor() {
    super('Nieprawidłowy login lub hasło', HttpStatus.BAD_REQUEST);
  }
}
