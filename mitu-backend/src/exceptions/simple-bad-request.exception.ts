import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionOutputDto } from 'src/dto/exception.output';

/**
 * Simple bad request exception
 * @export
 * @class SimpleBadRequest
 * @extends {HttpException}
 * @param {string} message
 * @constructor
 */
export class SimpleBadRequest extends HttpException {
  constructor(message: string) {
    super([new ExceptionOutputDto([message])], HttpStatus.BAD_REQUEST);
  }
}
