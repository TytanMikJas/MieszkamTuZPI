import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionOutputDto } from 'src/dto/exception.output';

export class SimpleNotFound extends HttpException {
  constructor(message: string) {
    super([new ExceptionOutputDto([message])], HttpStatus.NOT_FOUND);
  }
}
