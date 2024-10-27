import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum } from 'class-validator';
import TransformPrismaID from 'src/decorators/transformers/prismaid.transformer';
import { PRISMA_ID } from 'src/types';

export default class CommentDto {
  id: PRISMA_ID;
  @TransformPrismaID()
  parentNodeId: PRISMA_ID;
  @ApiProperty({ enum: $Enums.CommentStatus })
  @IsEnum($Enums.CommentStatus)
  status: $Enums.CommentStatus;
}
