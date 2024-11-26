import { PRISMA_ID } from 'src/types';
/**
 * Post moderate dto - dto for comments moderation
 * @export
 * @class PostModerateDto
 * @param {PRISMA_ID} id
 * @param {string} content
 * @param {string} thumbnail
 */
export default class PostModerateDto {
  id: PRISMA_ID;
  content: string;
  thumbnail?: string;
}
