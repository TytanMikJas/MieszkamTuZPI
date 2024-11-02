import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionOutputDto } from 'src/dto/exception.output';

/**
 * Simple not found exception
 * @export
 * @class SimpleNotFound
 * @extends {HttpException}
 * @param {string} message
 * @constructor
 */
export class SimpleNotFound extends HttpException {
  constructor(message: string) {
    super([new ExceptionOutputDto([message])], HttpStatus.NOT_FOUND);
  }
}
