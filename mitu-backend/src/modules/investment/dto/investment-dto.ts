import { IsEnum } from 'class-validator';
import { Badge, InvestmentCategory, InvestmentStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for Investment
 * @property {number} id - The id of the investment
 * @property {Date} updatedAt - The date of the last update
 * @property {string} title - The title of the investment
 * @property {string} slug - The slug of the investment
 * @property {number} locationX - The x coordinate of the location
 * @property {number} locationY - The y coordinate of the location
 * @property {string} area - The area of the investment
 * @property {string} street - The street of the investment
 * @property {string} buildingNr - The building number of the investment
 * @property {string} apartmentNr - The apartment number of the investment
 * @property {string} responsible - The responsible person for the investment
 * @property {boolean} isCommentable - The flag if the investment is commentable
 * @property {InvestmentStatus} status - The status of the investment
 * @property {string} thumbnail - The thumbnail of the investment
 * @property {Badge[]} badges - The badges of the investment
 * @property {InvestmentCategory} category - The category of the investment
 * @example
 * {
 *  id: 1,
 * updatedAt: '2021-09-01T00:00:00.000Z',
 * title: 'Investment 1',
 * slug: 'investment-1',
 * locationX: 1,
 * locationY: 1,
 * area: ''1,1',',
 * street: 'Street',
 * buildingNr: '1',
 * apartmentNr: '1',
 * responsible: 'John Doe',
 * isCommentable: true,
 * status: 'PENDING',
 * thumbnail: 'thumbnail.jpg',
 * badges: [
 *  {
 *    id: 1,
 *    name: 'badge1',
 *  },
 * ],
 * category:
 *  {
 *    id: 1,
 *    name: 'category1',
 *  },
 * }
 */
export class InvestmentDto {
  id: number;
  updatedAt: Date;
  title: string;
  slug: string;
  locationX: number;
  locationY: number;
  @ApiProperty({
    type: String,
    description: 'Longitude,Latitude;Longitude,Latitude',
  })
  area: string;
  street?: string;
  buildingNr?: string;
  apartmentNr?: string;
  responsible: string;
  isCommentable: boolean;
  @ApiProperty({ enum: InvestmentStatus })
  @IsEnum(InvestmentStatus)
  status: InvestmentStatus;
  thumbnail?: string;
  @ApiProperty({
    type: () => Object,
    description: 'List of badge names coma separated',
  })
  badges: Badge[];
  @ApiProperty({
    type: () => Object,
    description: 'Category of the investment',
  })
  category: InvestmentCategory;
}
