import { AnnouncementCategory } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

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
