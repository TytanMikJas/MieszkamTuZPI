import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionOutputDto } from 'src/dto/exception.output';

/**
 * Simple forbidden exception
 * @export
 * @class SimpleForbidden
 * @extends {HttpException}
 * @param {string} message
 * @constructor
 */
export class SimpleForbidden extends HttpException {
  constructor(message: string) {
    super([new ExceptionOutputDto([message])], HttpStatus.FORBIDDEN);
  }
}
