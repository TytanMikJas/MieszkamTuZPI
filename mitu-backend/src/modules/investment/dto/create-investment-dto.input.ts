import { IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator';
import { InvestmentStatus } from '@prisma/client';
import { LocationChain, PRISMA_ID } from 'src/types';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import TransformPrismaID from 'src/decorators/transformers/prismaid.transformer';
import {
  ERROR_APARTMENT_NR_TOO_LONG,
  ERROR_APARTMENT_NR_TOO_SHORT,
  ERROR_BUILDING_NR_TOO_LONG,
  ERROR_BUILDING_NR_TOO_SHORT,
  ERROR_INVESTMENT_CONTENT_TOO_LONG,
  ERROR_INVESTMENT_CONTENT_TOO_SHORT,
  ERROR_INVESTMENT_RESPONSIBLE_TOO_LONG,
  ERROR_INVESTMENT_RESPONSIBLE_TOO_SHORT,
  ERROR_INVESTMENT_TITLE_TOO_LONG,
  ERROR_INVESTMENT_TITLE_TOO_SHORT,
  ERROR_STREET_TOO_LONG,
  ERROR_STREET_TOO_SHORT,
} from 'src/strings';

import { ValidateLocationChain } from 'src/decorators/transformers/validate-location-chain.transformer';
import {
  MAX_LENGHT_INVESTMENT_RESPONSIBLE,
  MAX_LENGTH_APARTMENT_NR,
  MAX_LENGTH_BUILDING_NR,
  MAX_LENGTH_INVESTMENT_CONTENT,
  MAX_LENGTH_INVESTMENT_TITLE,
  MAX_LENGTH_STREET,
  MIN_LENGHT_INVESTMENT_RESPONSIBLE,
  MIN_LENGTH_APARTMENT_NR,
  MIN_LENGTH_BUILDING_NR,
  MIN_LENGTH_INVESTMENT_TITLE,
  MIN_LENGTH_STREET,
} from 'src/max-lengths';
import BadgeTransform from 'src/decorators/transformers/badge.transformer';
import TransformBoolean from 'src/decorators/transformers/boolean.transformer';

/**
 * Data transfer object for creating an investment
 * @property title - The title of the investment
 * @property locationX - The X coordinate of the investment
 * @property locationY - The Y coordinate of the investment
 * @property area - The area of the investment
 * @property street - The street of the investment
 * @property buildingNr - The building number of the investment
 * @property apartmentNr - The apartment number of the investment
 * @property responsible - The responsible person for the investment
 * @property isCommentable - Whether the investment is commentable
 * @property status - The status of the investment
 * @property thumbnail - The thumbnail of the investment
 * @property badges - The badges of the investment
 * @property categoryName - The category name of the investment
 * @example
 * ```ts
 * {
 * title: 'Investment title',
 * locationX: 12.345,
 * locationY: 12.345,
 * area: '12.345,12.345;12.345,12.345;12.345,12.345;12.345,12.345',
 * street: 'Investment street',
 * buildingNr: 'Investment building number',
 * apartmentNr: 'Investment apartment number',
 * responsible: 'Investment responsible',
 * isCommentable: true,
 * status: 'IN_PROGRESS',
 * thumbnail: 'thumbnail.jpg',
 * badges: ['badge1', 'badge2'],
 * categoryName: 'Investment category',
 * content: 'Investment content'
 * }
 * ```
 */
class CreateInvestmentDto {
  @MaxLength(MAX_LENGTH_INVESTMENT_TITLE, {
    message: ERROR_INVESTMENT_TITLE_TOO_LONG,
  })
  @MinLength(MIN_LENGTH_INVESTMENT_TITLE, {
    message: ERROR_INVESTMENT_TITLE_TOO_SHORT,
  })
  title: string;

  @TransformPrismaID()
  locationX: number;
  @TransformPrismaID()
  locationY: number;
  @ApiProperty({
    type: String,
    description:
      'Longitude,Latitude;Longitude,Latitude;Longitude,Latitude;Longitude,Latitude',
  })
  @ValidateLocationChain()
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

  @MaxLength(MAX_LENGHT_INVESTMENT_RESPONSIBLE, {
    message: ERROR_INVESTMENT_RESPONSIBLE_TOO_LONG,
  })
  @MinLength(MIN_LENGHT_INVESTMENT_RESPONSIBLE, {
    message: ERROR_INVESTMENT_RESPONSIBLE_TOO_SHORT,
  })
  responsible: string;

  @TransformBoolean()
  isCommentable: boolean;

  @ApiProperty({ enum: InvestmentStatus })
  @IsEnum(InvestmentStatus)
  status: InvestmentStatus;

  @IsOptional()
  @ApiProperty({
    type: String,
    description: `Original name of a file sent or already present in the post's files, which will be set as post's thumbnail`,
    required: false,
    example: 'lichtenstein.png',
  })
  @IsOptional()
  thumbnail?: string;

  @IsOptional()
  @BadgeTransform()
  badges: string[];

  categoryName: string;
}

export default class CreateInvestmentInputDto extends CreateInvestmentDto {
  @MaxLength(MAX_LENGTH_INVESTMENT_CONTENT, {
    message: ERROR_INVESTMENT_CONTENT_TOO_LONG,
  })
  @MinLength(MIN_LENGTH_INVESTMENT_TITLE, {
    message: ERROR_INVESTMENT_CONTENT_TOO_SHORT,
  })
  content: string;

  @Exclude()
  files?: any;
}

export class CreateInvestmentInputDtoWithId extends CreateInvestmentDto {
  @TransformPrismaID()
  id: PRISMA_ID;
  thumbnail? = null;
}
