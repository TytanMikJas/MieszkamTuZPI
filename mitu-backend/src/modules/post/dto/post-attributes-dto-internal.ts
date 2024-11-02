import { PRISMA_ID } from 'src/types';
import { Attachment } from '@prisma/client';
import PublicUserDto from 'src/modules/user/dto/public-user-dto';

/**
 * Post attributes dto
 * @export
 * @class PostAttributesDto
 * @param {PRISMA_ID} id
 * @param {string} thumbnail
 * @param {Attachment[]} attachments
 * @param {Comment[]} comments
 * @param {PRISMA_ID} createdById
 * @param {PublicUserDto} createdBy
 */
export default class PostAttributesDto {
  id: PRISMA_ID;
  thumbnail?: string;
  attachments?: Attachment[];
  comments?: Comment[];
  createdById: PRISMA_ID;
  createdBy: PublicUserDto;
}
