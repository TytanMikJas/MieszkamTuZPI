import { PipeTransform, Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
import { ERROR_PATCH_STATUS_COMMENT } from 'src/strings';

@Injectable()
export class ValidateCommentStatus implements PipeTransform {
  transform(value: string) {
    if (value in $Enums.CommentStatus) {
      return value;
    }
    throw new SimpleBadRequest(ERROR_PATCH_STATUS_COMMENT);
  }
}
