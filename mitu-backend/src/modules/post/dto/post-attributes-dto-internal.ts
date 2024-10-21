import { PRISMA_ID } from 'src/types';
import { Attachment } from '@prisma/client';
import PublicUserDto from 'src/modules/user/dto/public-user-dto';

export default class PostAttributesDto {
  id: PRISMA_ID;
  thumbnail?: string;
  attachments?: Attachment[];
  comments?: Comment[];
  createdById: PRISMA_ID;
  createdBy: PublicUserDto;
}
