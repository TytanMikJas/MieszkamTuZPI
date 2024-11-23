import { AnnouncementCategory } from '@prisma/client';

/**
 * Data transfer object for internal announcement management
 * @export
 * @class AnnouncementInternalDto
 * @param {number} id
 * @param {Date} updatedAt
 * @param {string} area
 * @param {AnnouncementCategory} category
 * @param {boolean} isCommentable
 */
export class AnnouncementInternalDto {
  id: number;
  updatedAt: Date;
  area?: string;
  category: AnnouncementCategory;
  isCommentable: boolean;
}
