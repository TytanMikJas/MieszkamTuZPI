/**
 * Update announcement internal dto.
 * @param {string} area - The area.
 * @param {string} categoryName - The category name.
 * @param {boolean} isCommentable - The is commentable.
 */
export default class AnnouncementExcludePoiDto {
  area: string;
  isCommentable: boolean;
  categoryName: string;
}
