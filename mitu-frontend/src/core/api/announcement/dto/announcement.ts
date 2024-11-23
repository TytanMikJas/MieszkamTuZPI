import CommentDto from '../../common/comment/CommentDto';
import CreatedByDto from '../../common/created-by/CreatedByDto';
import { RatingType } from '../../common/rating/RatingDto';
import MarkerablePostDto from '../../post/dto/markerable-post';
import { FilePathsDto } from '../../shared';

export default interface AnnouncementDto extends MarkerablePostDto {
  slug: string;
  address: string;
  isCommentable: boolean;
  content: string;
  upvoteCount: number;
  downvoteCount: number;
  thumbnail: string;
  commentCount: number;
  attachments: any[];
  comments: CommentDto[];
  filePaths: FilePathsDto;
  personalRating: RatingType;
  createdBy: CreatedByDto;
  responsible: string;
}
