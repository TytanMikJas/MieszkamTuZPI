import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionOutputDto } from 'src/dto/exception.output';

export class SimpleBadRequest extends HttpException {
  constructor(message: string) {
    super([new ExceptionOutputDto([message])], HttpStatus.BAD_REQUEST);
  }
}
