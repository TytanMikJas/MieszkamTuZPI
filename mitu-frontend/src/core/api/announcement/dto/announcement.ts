import CreatedByDto from '../../common/created-by/CreatedByDto';
import MarkerablePostDto from '../../post/dto/markerable-post';
import { FilePathsDto } from '../../shared';

export default interface AnnouncementDto extends MarkerablePostDto {
  slug: string;
  street?: string;
  buildingNr?: string;
  apartmentNr?: string;
  isCommentable: boolean;
  content: string;
  upvoteCount: number;
  downvoteCount: number;
  thumbnail: string;
  commentCount: number;
  attachments: any[];
  filePaths: FilePathsDto;
  createdBy: CreatedByDto;
  responsible: string;
}
