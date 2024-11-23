import CreatedByDto from '../../common/created-by/CreatedByDto';
import { PRISMA_ID } from '../../../types';

export default interface PostDto {
  id: PRISMA_ID;
  createdAt: string;
  postType: string;
  content: string;
  createdById: number;
  upvoteCount: number;
  downvoteCount: number;
  thumbnail: string;
  attachments: any[];
  comments: any[];
  commentCount: number;
  createdBy: CreatedByDto;
}
