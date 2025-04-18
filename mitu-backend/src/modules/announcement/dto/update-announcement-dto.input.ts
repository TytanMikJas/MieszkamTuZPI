import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { FileExcludeString, LocationChain } from 'src/types';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  ERROR_ANNOUNCEMENT_CONTENT_TOO_LONG,
  ERROR_ANNOUNCEMENT_CONTENT_TOO_SHORT,
  ERROR_ANNOUNCEMENT_RESPONSIBLE_TOO_LONG,
  ERROR_ANNOUNCEMENT_RESPONSIBLE_TOO_SHORT,
  ERROR_ANNOUNCEMENT_TITLE_TOO_LONG,
  ERROR_ANNOUNCEMENT_TITLE_TOO_SHORT,
  ERROR_APARTMENT_NR_TOO_LONG,
  ERROR_BUILDING_NR_TOO_LONG,
  ERROR_STREET_TOO_LONG,
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
} from 'src/max-lengths';
import { ValidateLocationChain } from '../../../decorators/transformers/validate-location-chain.transformer';
import TransformPrismaID from '../../../decorators/transformers/prismaid.transformer';
import TransformBoolean from 'src/decorators/transformers/boolean.transformer';

/**
 * Update announcement data transfer object
 * @export
 * @class UpdateAnnouncementDto
 * @param {string} title
 * @param {number} locationX
 * @param {number} locationY
 * @param {LocationChain} area
 * @param {string} street
 * @param {string} buildingNr
 * @param {string} apartmentNr
 * @param {string} categoryName
 * @param {boolean} isCommentable
 * @param {string} responsible
 * @param {string} content
 */
class UpdateAnnouncementDto {
  @Exclude()
  id: number;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @IsOptional()
  @MaxLength(MAX_LENGTH_ANNOUNCEMENT_TITLE, {
    message: ERROR_ANNOUNCEMENT_TITLE_TOO_LONG,
  })
  @MinLength(MIN_LENGTH_ANNOUNCEMENT_TITLE, {
    message: ERROR_ANNOUNCEMENT_TITLE_TOO_SHORT,
  })
  title: string;

  @Exclude()
  slug: string;

  @IsOptional()
  @TransformPrismaID()
  locationX: number;
  @IsOptional()
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
  street: string;

  @IsOptional()
  @MaxLength(MAX_LENGTH_BUILDING_NR, {
    message: ERROR_BUILDING_NR_TOO_LONG,
  })
  buildingNr: string;

  @IsOptional()
  @MaxLength(MAX_LENGTH_APARTMENT_NR, {
    message: ERROR_APARTMENT_NR_TOO_LONG,
  })
  apartmentNr: string;

  @IsOptional()
  categoryName: string;

  @IsOptional()
  @TransformBoolean()
  isCommentable: boolean;

  @IsOptional()
  @MaxLength(MAX_LENGHT_ANNOUNCEMENT_RESPONSIBLE, {
    message: ERROR_ANNOUNCEMENT_RESPONSIBLE_TOO_LONG,
  })
  @MinLength(MIN_LENGHT_ANNOUNCEMENT_RESPONSIBLE, {
    message: ERROR_ANNOUNCEMENT_RESPONSIBLE_TOO_SHORT,
  })
  responsible: string;
}

/**
 * Update announcement internal data transfer object
 * @export
 * @class UpdateAnnouncementInternalDto
 */
export default class UpdateAnnouncementInternalDto extends UpdateAnnouncementDto {}

/**
 * Update announcement input data transfer object
 * @export
 * @class UpdateAnnouncementInputDto
 */
export class UpdateAnnouncementInputDto extends UpdateAnnouncementInternalDto {
  @IsOptional()
  @ApiProperty({
    type: String,
    description: `Semicolon separated *type/originalname* string informing which post's files to remove`,
    required: false,
    example: 'images/lichtenstein.png;tds/duck.gltf;doc/sample.pdf',
  })
  exclude?: FileExcludeString;
  @IsOptional()
  @ApiProperty({
    type: String,
    description: `Original name of a file sent or already present in the post's files, which will be set as post's thumbnail`,
    required: false,
    example: 'lichtenstein.png',
  })
  thumbnail?: string;
  @Exclude()
  files?: any;
  @IsOptional()
  @MaxLength(MAX_LENGTH_ANNOUNCEMENT_CONTENT, {
    message: ERROR_ANNOUNCEMENT_CONTENT_TOO_LONG,
  })
  @MinLength(MIN_LENGTH_ANNOUNCEMENT_CONTENT, {
    message: ERROR_ANNOUNCEMENT_CONTENT_TOO_SHORT,
  })
  content: string;
}
