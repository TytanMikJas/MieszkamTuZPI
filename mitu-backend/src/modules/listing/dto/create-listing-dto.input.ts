import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { PRISMA_ID } from 'src/types';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  MAX_LENGHT_LISTING_RESPONSIBLE,
  MAX_LENGTH_LISTING_CONTENT,
  MAX_LENGTH_LISTING_TITLE,
  MIN_LENGHT_LISTING_RESPONSIBLE,
  MIN_LENGTH_LISTING_CONTENT,
  MIN_LENGTH_LISTING_TITLE,
  MAX_LENGTH_APARTMENT_NR,
  MAX_LENGTH_BUILDING_NR,
  MAX_LENGTH_STREET,
  MIN_LENGTH_APARTMENT_NR,
  MIN_LENGTH_BUILDING_NR,
  MIN_LENGTH_STREET,
} from 'src/max-lengths';
import {
  ERROR_APARTMENT_NR_TOO_LONG,
  ERROR_APARTMENT_NR_TOO_SHORT,
  ERROR_BUILDING_NR_TOO_LONG,
  ERROR_BUILDING_NR_TOO_SHORT,
  ERROR_STREET_TOO_LONG,
  ERROR_STREET_TOO_SHORT,
  ERROR_LISTING_RESPONSIBLE_TOO_LONG,
  ERROR_LISTING_RESPONSIBLE_TOO_SHORT,
  ERROR_LISTING_CONTENT_TOO_LONG,
  ERROR_LISTING_CONTENT_TOO_SHORT,
  ERROR_LISTING_TITLE_TOO_LONG,
  ERROR_LISTING_TITLE_TOO_SHORT,
} from 'src/strings';
import TransformPrismaID from 'src/decorators/transformers/prismaid.transformer';
import TransformBoolean from 'src/decorators/transformers/boolean.transformer';

/**
 * DTO for creating a listing
 * @property title - The title of the listing
 * @property locationX - The X coordinate of the listing
 * @property locationY - The Y coordinate of the listing
 * @property street - The street of the listing
 * @property buildingNr - The building number of the listing
 * @property apartmentNr - The apartment number of the listing
 * @property thumbnail - The thumbnail of the investment
 * @property price - The price of the listing
 * @property surface - The surface of the listing
 * @property responsible - The responsible person for the listing
 * @property sell - Whether the listing is for sale
 * @example
 * ```ts
 * {
 * title: 'Listing title',
 * locationX: 12.345,
 * locationY: 12.345,
 * street: 'Listing street',
 * buildingNr: 'Listing building number',
 * apartmentNr: 'Listing apartment number',
 * price: 12345,
 * surface: 200,
 * responsible: 'UM Czestochowa',
 * sell: true,
 * }
 * ```
 */
export class CreateListingDto {
  @MaxLength(MAX_LENGTH_LISTING_TITLE, {
    message: ERROR_LISTING_TITLE_TOO_LONG,
  })
  @MinLength(MIN_LENGTH_LISTING_TITLE, {
    message: ERROR_LISTING_TITLE_TOO_SHORT,
  })
  title: string;

  @TransformPrismaID()
  locationX: number;

  @TransformPrismaID()
  locationY: number;

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

  @MaxLength(MAX_LENGHT_LISTING_RESPONSIBLE, {
    message: ERROR_LISTING_RESPONSIBLE_TOO_LONG,
  })
  @MinLength(MIN_LENGHT_LISTING_RESPONSIBLE, {
    message: ERROR_LISTING_RESPONSIBLE_TOO_SHORT,
  })
  responsible: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    description: `Original name of a file sent or already present in the post's files, which will be set as post's thumbnail`,
    required: false,
    example: 'lichtenstein.png',
  })
  @IsOptional()
  thumbnail?: string;

  @TransformPrismaID()
  price: number;

  @TransformPrismaID()
  surface: number;

  @TransformBoolean()
  sell: boolean;
}

/**
 * DTO for creating a listing with an ID
 * @property id - The ID of the listing
 * @example
 * ```ts
 * {
 * id: 1,
 * title: 'Listing title',
 * locationX: 12.345,
 * locationY: 12.345,
 * street: 'Listing street',
 * buildingNr: 'Listing building number',
 * apartmentNr: 'Listing apartment number',
 * price: 12345,
 * surface: 200,
 * responsible: 'UM Czestochowa',
 * sell: true,
 * }
 * ```
 */
export default class CreateListingInputDto extends CreateListingDto {
  @IsOptional()
  @MaxLength(MAX_LENGTH_LISTING_CONTENT, {
    message: ERROR_LISTING_CONTENT_TOO_LONG,
  })
  @MinLength(MIN_LENGTH_LISTING_CONTENT, {
    message: ERROR_LISTING_CONTENT_TOO_SHORT,
  })
  content: string;

  @Exclude()
  files?: any;
}

/**
 * DTO for creating a listing with an ID
 * @property id - The ID of the listing
 * @example
 * ```ts
 * {
 * id: 1,
 * title: 'Listing title',
 * locationX: 12.345,
 * locationY: 12.345,
 * street: 'Listing street',
 * buildingNr: 'Listing building number',
 * apartmentNr: 'Listing apartment number',
 * price: 12345,
 * surface: 200,
 * responsible: 'UM Czestochowa',
 * sell: true,
 * }
 * ```
 */
export class CreateListingInputDtoWithId extends CreateListingDto {
  id: PRISMA_ID;
  thumbnail? = null;
}
