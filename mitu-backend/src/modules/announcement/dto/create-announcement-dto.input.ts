import { IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator';
import { LocationChain, PRISMA_ID } from 'src/types';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import TransformPrismaID from 'src/decorators/transformers/prismaid.transformer';
import {
  ERROR_ADDRESS_TOO_LONG,
  ERROR_ADDRESS_TOO_SHORT,
  ERROR_ANNOUNCEMENT_CONTENT_TOO_LONG,
  ERROR_ANNOUNCEMENT_CONTENT_TOO_SHORT,
  ERROR_ANNOUNCEMENT_RESPONSIBLE_TOO_LONG,
  ERROR_ANNOUNCEMENT_RESPONSIBLE_TOO_SHORT,
  ERROR_ANNOUNCEMENT_TITLE_TOO_LONG,
  ERROR_ANNOUNCEMENT_TITLE_TOO_SHORT,
} from 'src/strings';

import ValidateAddress from 'src/decorators/transformers/validate-address.transformer';
import {
  MAX_LENGHT_ANNOUNCEMENT_RESPONSIBLE,
  MAX_LENGTH_ADDRESS,
  MAX_LENGTH_ANNOUNCEMENT_CONTENT,
  MAX_LENGTH_ANNOUNCEMENT_TITLE,
  MIN_LENGHT_ANNOUNCEMENT_RESPONSIBLE,
  MIN_LENGTH_ADDRESS,
  MIN_LENGTH_ANNOUNCEMENT_CONTENT,
  MIN_LENGTH_ANNOUNCEMENT_TITLE,
} from 'src/max-lengths';
import { ValidateLocationChain } from '../../../decorators/transformers/validate-location-chain.transformer';
import TransformBoolean from '../../../decorators/transformers/boolean.transformer';
import { District } from '@prisma/client';

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
  @ValidateAddress()
  @MaxLength(MAX_LENGTH_ADDRESS, {
    message: ERROR_ADDRESS_TOO_LONG,
  })
  @MinLength(MIN_LENGTH_ADDRESS, {
    message: ERROR_ADDRESS_TOO_SHORT,
  })
  address: string;
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

  @IsOptional()
  @ApiProperty({ enum: District })
  @IsEnum(District)
  district: District;

  @MaxLength(MAX_LENGHT_ANNOUNCEMENT_RESPONSIBLE, {
    message: ERROR_ANNOUNCEMENT_RESPONSIBLE_TOO_LONG,
  })
  @MinLength(MIN_LENGHT_ANNOUNCEMENT_RESPONSIBLE, {
    message: ERROR_ANNOUNCEMENT_RESPONSIBLE_TOO_SHORT,
  })
  responsible: string;
}

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

export class CreateAnnouncementInputDtoWithId extends CreateAnnouncementDto {
  @TransformPrismaID()
  id: PRISMA_ID;
  thumbnail? = null;
}
