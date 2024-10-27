import { CommentStatus, FilePaths } from '../../../../types';
import CreatedByDto from '../created-by/CreatedByDto';
import { RatingType } from '@/core/api/common/rating/RatingDto';

export default interface CommentDto {
  id: number;
  parentNodeId: number;
  createdBy: CreatedByDto;
  createdAt: string;
  status: CommentStatus;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
  filePaths: FilePaths;
  content: string;
  comments: CommentDto[];
  currentPage: number;
  loadingSubcomments: boolean;
  loadingRating: boolean;
  thumbnail: string;
  personalRating: RatingType;
}
