import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionOutputDto } from 'src/dto/exception.output';

export class InvalidValidationException extends HttpException {
  constructor(errors: ExceptionOutputDto[]) {
    super(errors, HttpStatus.BAD_REQUEST);
  }
}
