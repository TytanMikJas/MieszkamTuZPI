import { PipeTransform, Injectable } from '@nestjs/common';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
import {
  MAX_LENGTH_COMMENT_CONTENT,
  MIN_LENGTH_COMMENT_CONTENT,
} from 'src/max-lengths';
import {
  ERROR_PATCH_CONTENT_COMMENT_EMPTY,
  ERROR_PATCH_CONTENT_COMMENT_TOO_LONG,
  ERROR_PATCH_CONTENT_COMMENT_TOO_SHORT,
} from 'src/strings';

/**
 * Validate comment content
 * @export
 * @class ValidateCommentContent
 * @implements {PipeTransform}
 */
@Injectable()
export class ValidateCommentContent implements PipeTransform {
  /**
   * Transform value
   * @param {string} value
   * @returns {string}
   */
  transform(value: string) {
    if (!value || value.length < 1) {
      throw new SimpleBadRequest(ERROR_PATCH_CONTENT_COMMENT_EMPTY);
    }

    if (value.length > MAX_LENGTH_COMMENT_CONTENT) {
      throw new SimpleBadRequest(ERROR_PATCH_CONTENT_COMMENT_TOO_LONG);
    }

    if (value.length < MIN_LENGTH_COMMENT_CONTENT) {
      throw new SimpleBadRequest(ERROR_PATCH_CONTENT_COMMENT_TOO_SHORT);
    }

    return value;
  }
}
