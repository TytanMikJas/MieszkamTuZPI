import { CommentStatus } from '@/types';

export default interface EditCommentDto {
  id: string;
  parentNodeId: string;
  content: string;
  status: CommentStatus;
}
