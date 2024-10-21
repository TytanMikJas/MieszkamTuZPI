import { AnnouncementCategory } from '@prisma/client';

export class AnnouncementInternalDto {
  id: number;
  updatedAt: Date;
  area?: string;
  category: AnnouncementCategory;
  isCommentable: boolean;
}
