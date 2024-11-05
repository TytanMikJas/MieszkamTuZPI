import { InvalidValidationException } from './exceptions/invalid-validation.exception';
import { RenderType } from './dto/exception.output';
import { ValidationPipe } from '@nestjs/common';

/**
 * Pipe to validate the class-validator decorators.
 */
export const ClassValidatorPipe = new ValidationPipe({
  transform: true,
  exceptionFactory: (errors) => {
    return new InvalidValidationException(
      errors.map((error) => {
        return {
          type: RenderType.alert,
          field: error.property,
          messages: Object.values(error.constraints),
        };
      }),
    );
  },
});
