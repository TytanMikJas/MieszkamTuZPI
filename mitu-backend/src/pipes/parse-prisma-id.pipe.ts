import { PipeTransform, Injectable } from '@nestjs/common';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
import { ERROR_INVALID_ID } from 'src/strings';

@Injectable()
export class ParsePrismaID implements PipeTransform {
  transform(value: string) {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      throw new SimpleBadRequest(ERROR_INVALID_ID);
    }
    return parsedValue;
  }
}
