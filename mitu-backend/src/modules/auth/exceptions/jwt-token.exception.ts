import { HttpException, HttpStatus } from '@nestjs/common';

export default class JwtException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
