import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionOutputDto, RenderType } from 'src/dto/exception.output';
import { ERROR_INVALID_PASSWORD, USER_LOGIN_ALREADY_EXISTS } from 'src/strings';

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

export class InvalidPasswordException extends InvalidInputException {
  constructor() {
    super(ERROR_INVALID_PASSWORD, HttpStatus.CONFLICT, RenderType.form);
  }
}

export class InvalidEmailException extends InvalidInputException {
  constructor() {
    super(
      USER_LOGIN_ALREADY_EXISTS,
      HttpStatus.BAD_REQUEST,
      RenderType.form,
      'email',
    );
  }
}
