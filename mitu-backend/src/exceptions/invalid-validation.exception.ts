import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionOutputDto } from 'src/dto/exception.output';

/**
 * Invalid validation exception
 * @export
 * @class InvalidValidationException
 * @extends {HttpException}
 * @param {ExceptionOutputDto[]} errors
 * @constructor
 */
export class InvalidValidationException extends HttpException {
  constructor(errors: ExceptionOutputDto[]) {
    super(errors, HttpStatus.BAD_REQUEST);
  }
}
