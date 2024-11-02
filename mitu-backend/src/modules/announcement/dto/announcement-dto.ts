import { AnnouncementCategory } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for announcement
 * @export
 * @class AnnouncementDto
 * @param {number} id
 * @param {Date} updatedAt
 * @param {string} title
 * @param {number} locationX
 * @param {number} locationY
 * @param {string} area
 * @param {string} street
 * @param {string} buildingNr
 * @param {string} apartmentNr
 * @param {string} thumbnail
 * @param {AnnouncementCategory} category
 * @param {boolean} isCommentable
 * @param {string} slug
 * @param {string} responsible
 */
export class AnnouncementDto {
  id: number;
  updatedAt: Date;
  title: string;
  locationX: number;
  locationY: number;
  area?: string;
  street?: string;
  buildingNr?: string;
  apartmentNr?: string;
  thumbnail?: string;
  @ApiProperty({
    type: () => Object,
    description: 'Category of the announcement',
  })
  category: AnnouncementCategory;
  isCommentable: boolean;
  slug: string;
  responsible: string;
}
