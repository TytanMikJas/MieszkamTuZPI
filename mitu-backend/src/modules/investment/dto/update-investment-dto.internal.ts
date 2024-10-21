/**
 * Update investment internal dto.
 * @param {string} area - The area.
 * @param {string} categoryName - The category name.
 * @param {boolean} isCommentable - The is commentable.
 * @param {string} status - The status.
 * @param {string[]} badges - The badges.
 */
export default class UpdateInvestmentExcludePoiDto {
  area: string;
  isCommentable: boolean;
  status: string;
  badges: string[];
  categoryName: string;
}
