import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * JWT exception
 * @export
 * @class JwtException
 * @extends {HttpException}
 * @param {string} message
 * @constructor
 */
export default class JwtException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
