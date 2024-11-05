import { Attachment, PostType } from '@prisma/client';
import { PRISMA_ID } from 'src/types';
import PublicUserDto from '../../user/dto/public-user-dto';
import { RatingType } from 'src/modules/rating/dto/rating-dto';

/**
 * Post dto
 * @export
 * @class PostDto
 * @param {PRISMA_ID} id
 * @param {Date} createdAt
 * @param {PostType} postType
 * @param {string} thumbnail
 * @param {Attachment[]} attachments
 * @param {number} upvoteCount
 * @param {number} downvoteCount
 * @param {Comment[]} comments
 * @param {PRISMA_ID} createdById
 */
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

/**
 * Post dto with user
 * @export
 * @class PostDtoWithUser
 * @extends {PostDto}
 * @param {PublicUserDto} createdBy
 */
export class PostDtoWithUser extends PostDto {
  createdBy: PublicUserDto;
}
