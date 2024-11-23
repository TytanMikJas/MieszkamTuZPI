import { $Enums } from '@prisma/client';
import { PRISMA_ID } from 'src/types';

/**
 * Edit comment output dto
 * @export
 * @class EditCommentOutputDto
 * @param {PRISMA_ID} id
 * @param {PRISMA_ID} parentNodeId
 * @param {string} content
 * @param {$Enums.CommentStatus} status
 */
export class EditCommentOutputDto {
  id: PRISMA_ID;
  parentNodeId: PRISMA_ID;
  content: string;
  status: $Enums.CommentStatus;
}
