import { $Enums } from '@prisma/client';
import TransformPrismaID from 'src/decorators/transformers/prismaid.transformer';
import { PRISMA_ID } from 'src/types';

/**
 * DTO for an attachment
 * @property postId - The ID of the post to delete the attachment from
 * @property fileName - The name of the file to delete
 * @property fileType - The type of the file - {@link FileType}
 * @property postType - The type of the post - {@link PostType}
 * @example
 * ```ts
 * {
 * postId: '123',
 * fileName: 'example.jpg',
 * fileType: FileType.IMAGE,
 * postType: PostType.INVESTMENT
 * }
 */
export default class AttachmentDto {
  @TransformPrismaID()
  postId: PRISMA_ID;
  fileName: string;
  fileType: $Enums.FileType;
  postType: $Enums.PostType;
}
