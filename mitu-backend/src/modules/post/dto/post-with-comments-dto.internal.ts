import { CommentStatus, PostType } from '@prisma/client';
import { PRISMA_ID } from 'src/types';

export default class PostCommentsContentInternalDto {
  /**
   * Post id
   * @type {PRISMA_ID}
   */
  id: PRISMA_ID;
  /**
   * Post type
   * @type {string}
   */
  postType: PostType;
  /**
   * Post content
   * @type {string}
   */
  comments: CommentWithContentDto[];
}

export class CommentWithContentDto {
  content: string;
  status: CommentStatus;
}
