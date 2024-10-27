import { $Enums } from '@prisma/client';
import { PRISMA_ID } from 'src/types';

export class EditCommentOutputDto {
  id: PRISMA_ID;
  parentNodeId: PRISMA_ID;
  content: string;
  status: $Enums.CommentStatus;
}
