import { AnnouncementCategory, District } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AnnouncementDto {
  id: number;
  updatedAt: Date;
  title: string;
  locationX: number;
  locationY: number;
  area?: string;
  address: string;
  thumbnail?: string;
  @ApiProperty({
    type: () => Object,
    description: 'Category of the announcement',
  })
  category: AnnouncementCategory;
  isCommentable: boolean;
  slug: string;
  responsible: string;
  district?: District;
}
