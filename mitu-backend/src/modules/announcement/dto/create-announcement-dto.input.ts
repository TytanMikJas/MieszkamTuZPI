import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { LocationChain, PRISMA_ID } from 'src/types';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import TransformPrismaID from 'src/decorators/transformers/prismaid.transformer';
import {
  ERROR_ANNOUNCEMENT_CONTENT_TOO_LONG,
  ERROR_ANNOUNCEMENT_CONTENT_TOO_SHORT,
  ERROR_ANNOUNCEMENT_RESPONSIBLE_TOO_LONG,
  ERROR_ANNOUNCEMENT_RESPONSIBLE_TOO_SHORT,
  ERROR_ANNOUNCEMENT_TITLE_TOO_LONG,
  ERROR_ANNOUNCEMENT_TITLE_TOO_SHORT,
  ERROR_APARTMENT_NR_TOO_LONG,
  ERROR_APARTMENT_NR_TOO_SHORT,
  ERROR_BUILDING_NR_TOO_LONG,
  ERROR_BUILDING_NR_TOO_SHORT,
  ERROR_STREET_TOO_LONG,
  ERROR_STREET_TOO_SHORT,
} from 'src/strings';
import {
  MAX_LENGHT_ANNOUNCEMENT_RESPONSIBLE,
  MAX_LENGTH_ANNOUNCEMENT_CONTENT,
  MAX_LENGTH_ANNOUNCEMENT_TITLE,
  MAX_LENGTH_APARTMENT_NR,
  MAX_LENGTH_BUILDING_NR,
  MAX_LENGTH_STREET,
  MIN_LENGHT_ANNOUNCEMENT_RESPONSIBLE,
  MIN_LENGTH_ANNOUNCEMENT_CONTENT,
  MIN_LENGTH_ANNOUNCEMENT_TITLE,
  MIN_LENGTH_APARTMENT_NR,
  MIN_LENGTH_BUILDING_NR,
  MIN_LENGTH_STREET,
} from 'src/max-lengths';
import { ValidateLocationChain } from '../../../decorators/transformers/validate-location-chain.transformer';
import TransformBoolean from '../../../decorators/transformers/boolean.transformer';

/**
 * Create announcement data transfer object
 * @export
 * @class CreateAnnouncementDto
 * @param {string} title
 * @param {number} locationX
 * @param {number} locationY
 * @param {LocationChain} area
 * @param {string} street
 * @param {string} buildingNr
 * @param {string} apartmentNr
 * @param {string} thumbnail
 * @param {string} categoryName
 * @param {boolean} isCommentable
 * @param {string} responsible
 * @param {string} content
 * @param {any} files
 */
class CreateAnnouncementDto {
  @MaxLength(MAX_LENGTH_ANNOUNCEMENT_TITLE, {
    message: ERROR_ANNOUNCEMENT_TITLE_TOO_LONG,
  })
  @MinLength(MIN_LENGTH_ANNOUNCEMENT_TITLE, {
    message: ERROR_ANNOUNCEMENT_TITLE_TOO_SHORT,
  })
  title: string;
  @TransformPrismaID()
  locationX: number;
  @TransformPrismaID()
  locationY: number;
  @ApiProperty({
    type: String,
    description: 'Longitude,Latitude;Longitude,Latitude',
  })
  @ValidateLocationChain()
  @IsOptional()
  area: LocationChain;

  @IsOptional()
  @MaxLength(MAX_LENGTH_STREET, {
    message: ERROR_STREET_TOO_LONG,
  })
  @MinLength(MIN_LENGTH_STREET, {
    message: ERROR_STREET_TOO_SHORT,
  })
  street: string;

  @IsOptional()
  @MaxLength(MAX_LENGTH_BUILDING_NR, {
    message: ERROR_BUILDING_NR_TOO_LONG,
  })
  @MinLength(MIN_LENGTH_BUILDING_NR, {
    message: ERROR_BUILDING_NR_TOO_SHORT,
  })
  buildingNr: string;

  @IsOptional()
  @MaxLength(MAX_LENGTH_APARTMENT_NR, {
    message: ERROR_APARTMENT_NR_TOO_LONG,
  })
  @MinLength(MIN_LENGTH_APARTMENT_NR, {
    message: ERROR_APARTMENT_NR_TOO_SHORT,
  })
  apartmentNr: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    description: `Original name of a file sent or already present in the post's files, which will be set as post's thumbnail`,
    required: false,
    example: 'lichtenstein.png',
  })
  @IsOptional()
  thumbnail?: string;
  categoryName: string;

  @TransformBoolean()
  isCommentable: boolean;

  @MaxLength(MAX_LENGHT_ANNOUNCEMENT_RESPONSIBLE, {
    message: ERROR_ANNOUNCEMENT_RESPONSIBLE_TOO_LONG,
  })
  @MinLength(MIN_LENGHT_ANNOUNCEMENT_RESPONSIBLE, {
    message: ERROR_ANNOUNCEMENT_RESPONSIBLE_TOO_SHORT,
  })
  responsible: string;
}

/**
 * Create announcement input data transfer object
 * @export
 * @class CreateAnnouncementInputDto
 * @extends {CreateAnnouncementDto}
 * @param {string} content
 * @param {any} files
 */
export default class CreateAnnouncementInputDto extends CreateAnnouncementDto {
  @MaxLength(MAX_LENGTH_ANNOUNCEMENT_CONTENT, {
    message: ERROR_ANNOUNCEMENT_CONTENT_TOO_LONG,
  })
  @MinLength(MIN_LENGTH_ANNOUNCEMENT_CONTENT, {
    message: ERROR_ANNOUNCEMENT_CONTENT_TOO_SHORT,
  })
  content: string;
  @Exclude()
  files?: any;
}

/**
 * Create announcement input data transfer object with id
 * @export
 * @class CreateAnnouncementInputDtoWithId
 * @extends {CreateAnnouncementDto}
 * @param {PRISMA_ID} id
 * @param {string} content
 * @param {any} files
 */
export class CreateAnnouncementInputDtoWithId extends CreateAnnouncementDto {
  @TransformPrismaID()
  id: PRISMA_ID;
  thumbnail? = null;
}
