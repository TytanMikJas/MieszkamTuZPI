import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionOutputDto, RenderType } from 'src/dto/exception.output';

export class InvalidInputException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus,
    type: RenderType = RenderType.alert,
    field: string = '',
  ) {
    const _e = new ExceptionOutputDto([message], field, type);
    super([_e], status);
  }
}
