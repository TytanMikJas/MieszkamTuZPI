import { Badge, InvestmentCategory, InvestmentStatus } from '@prisma/client';
/**
 * Investment internal DTO.
 * @class
 * @exports
 * @constructor
 * @param {number} id - The id of investment.
 * @param {Date} updatedAt - The last updated at date.
 * @param {string} area - The area of the investment.
 * @param {InvestmentCategory} category - The category of the investment.
 * @param {boolean} isCommentable - The is commentable flag.
 * @param {InvestmentStatus} status - The status of the investment.
 * @param {Badge[]} badges - The badges of the investment.
 */
export class InvestmentInternalDto {
  id: number;
  updatedAt: Date;
  area: string;
  category: InvestmentCategory;
  isCommentable: boolean;
  status: InvestmentStatus;
  badges: Badge[];
}
