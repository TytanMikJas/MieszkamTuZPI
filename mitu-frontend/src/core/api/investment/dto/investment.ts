import { InvestmentStatus } from '@/types';
import CreatedByDto from '../../common/created-by/CreatedByDto';
import { FilePathsDto } from '../../shared';
import BadgeDto from './badge';

import MarkerablePostDto from '../../post/dto/markerable-post';

export default interface InvestmentDto extends MarkerablePostDto {
  slug: string;
  street: string;
  buildingNr: string;
  apartmentNr: string;
  responsible: string;
  isCommentable: boolean;
  status: InvestmentStatus;
  badges: BadgeDto[];
  content: string;
  upvoteCount: number;
  downvoteCount: number;
  thumbnail: string;
  commentCount: number;
  attachments: any[];
  filePaths: FilePathsDto;
  createdBy: CreatedByDto;
}
