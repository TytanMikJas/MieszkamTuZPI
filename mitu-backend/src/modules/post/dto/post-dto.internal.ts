import { Attachment, PostType } from '@prisma/client';
import { PRISMA_ID } from 'src/types';
import PublicUserDto from '../../user/dto/public-user-dto';
import { RatingType } from 'src/modules/rating/dto/rating-dto';

export default class PostDto {
  id: PRISMA_ID;
  createdAt: Date;
  postType: PostType;
  thumbnail?: string;
  attachments?: Attachment[];
  upvoteCount: number;
  downvoteCount: number;
  comments?: Comment[];
  createdById: PRISMA_ID;
  personalRating?: RatingType;
}

export class PostDtoWithUser extends PostDto {
  createdBy: PublicUserDto;
}
