import { InvestmentStatus } from '@prisma/client';

/**
 * Update investment internal dto.
 * @param {string} area - The area.
 * @param {string} categoryName - The category name.
 * @param {boolean} isCommentable - The is commentable.
 * @param {string} status - The status.
 * @param {string[]} badges - The badges.
 */
export default class InvestmentExcludePoiDto {
  area: string;
  isCommentable: boolean;
  status: InvestmentStatus;
  badges: string[];
  categoryName: string;
}
