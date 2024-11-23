import TransformPrismaID from 'src/decorators/transformers/prismaid.transformer';
import { PRISMA_ID } from 'src/types';

/**
 * DTO for deleting an attachment for a given post
 * @property postId - The ID of the post to delete the attachment from
 * @property fileName - The name of the file to delete
 * @example
 * ```ts
 * {
 *  postId: '123',
 *  fileName: 'example.jpg'
 * }
 * ```
 */
export class DeleteAttachmentDto {
  @TransformPrismaID()
  postId: PRISMA_ID;
  fileName: string;
}
