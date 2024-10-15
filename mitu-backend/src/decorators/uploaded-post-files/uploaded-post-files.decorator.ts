import { UploadedFiles } from '@nestjs/common';
import { FileTypeValidationPipe } from './file-type-validation.pipe';
import { $Enums } from '@prisma/client';
/**
 * Decorator to retrieve and validate the files uploaded in a post request.
 * @param type The type of the post, for which the files are validated.
 * @returns
 */
export function UploadedPostFiles(type: $Enums.PostType) {
  return UploadedFiles(new FileTypeValidationPipe(type));
}
