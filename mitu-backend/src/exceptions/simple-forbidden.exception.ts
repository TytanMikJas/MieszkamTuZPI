import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionOutputDto } from 'src/dto/exception.output';

export class SimpleForbidden extends HttpException {
  constructor(message: string) {
    super([new ExceptionOutputDto([message])], HttpStatus.FORBIDDEN);
  }
}
