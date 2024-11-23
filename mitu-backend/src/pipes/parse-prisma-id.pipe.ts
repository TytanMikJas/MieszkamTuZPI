import { PipeTransform, Injectable } from '@nestjs/common';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
import { ERROR_INVALID_ID } from 'src/strings';

/**
 * Parse Prisma ID
 * @export
 * @class ParsePrismaID
 * @implements {PipeTransform}
 */
@Injectable()
export class ParsePrismaID implements PipeTransform {
  /**
   * Transform value
   * @param {string} value
   * @returns {number}
   */
  transform(value: string) {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      throw new SimpleBadRequest(ERROR_INVALID_ID);
    }
    return parsedValue;
  }
}
