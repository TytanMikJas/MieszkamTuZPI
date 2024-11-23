import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import { FileExcludeString } from 'src/types';
import { ApiProperty } from '@nestjs/swagger';
import {
  MAX_LENGHT_LISTING_RESPONSIBLE,
  MAX_LENGTH_LISTING_CONTENT,
  MAX_LENGTH_LISTING_TITLE,
  MAX_LENGTH_APARTMENT_NR,
  MAX_LENGTH_BUILDING_NR,
  MAX_LENGTH_STREET,
  MIN_LENGHT_LISTING_RESPONSIBLE,
  MIN_LENGTH_LISTING_CONTENT,
  MIN_LENGTH_LISTING_TITLE,
} from 'src/max-lengths';
import {
  ERROR_APARTMENT_NR_TOO_LONG,
  ERROR_BUILDING_NR_TOO_LONG,
  ERROR_STREET_TOO_LONG,
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
 * DTO for updating a listing
 * @property title - The title of the listing
 * @property locationX - The X coordinate of the listing
 * @property locationY - The Y coordinate of the listing
 * @property street - The street of the listing
 * @property buildingNr - The building number of the listing
 * @property apartmentNr - The apartment number of the listing
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
export default class UpdateListingInternalDto {
  @Exclude()
  id: number;

  @Exclude()
  updatedAt: Date;

  @IsOptional()
  @MaxLength(MAX_LENGTH_LISTING_TITLE, {
    message: ERROR_LISTING_TITLE_TOO_LONG,
  })
  @MinLength(MIN_LENGTH_LISTING_TITLE, {
    message: ERROR_LISTING_TITLE_TOO_SHORT,
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
  @Transform(({ value }) => Number(value))
  price: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  surface: number;

  @IsOptional()
  @MaxLength(MAX_LENGHT_LISTING_RESPONSIBLE, {
    message: ERROR_LISTING_RESPONSIBLE_TOO_LONG,
  })
  @MinLength(MIN_LENGHT_LISTING_RESPONSIBLE, {
    message: ERROR_LISTING_RESPONSIBLE_TOO_SHORT,
  })
  responsible: string;

  @IsOptional()
  @TransformBoolean()
  sell: boolean;
}

/**
 * DTO for updating a listing
 * @property exclude - Semicolon separated *type/originalname* string informing which post's files to remove
 * @property thumbnail - Original name of a file sent or already present in the post's files, which will be set as post's thumbnail
 * @property content - The content of the listing
 * @example
 * ```ts
 * {
 * exclude: 'images/lichtenstein.png;tds/duck.gltf;doc/sample.pdf',
 * thumbnail: 'lichtenstein.png',
 * content: 'Listing content',
 * }
 * ```
 */
export class UpdateListingInputDto extends UpdateListingInternalDto {
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
  @MaxLength(MAX_LENGTH_LISTING_CONTENT, {
    message: ERROR_LISTING_CONTENT_TOO_LONG,
  })
  @MinLength(MIN_LENGTH_LISTING_CONTENT, {
    message: ERROR_LISTING_CONTENT_TOO_SHORT,
  })
  content: string;
}
