import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEnum, MaxLength, MinLength } from 'class-validator';
import TransformPrismaID from 'src/decorators/transformers/prismaid.transformer';
import {
  MAX_LENGTH_COMMENT_CONTENT,
  MIN_LENGTH_COMMENT_CONTENT,
} from 'src/max-lengths';
import {
  ERROR_PATCH_CONTENT_COMMENT_TOO_LONG,
  ERROR_PATCH_CONTENT_COMMENT_TOO_SHORT,
} from 'src/strings';
import { PRISMA_ID } from 'src/types';

class CreateCommentDto {
  @TransformPrismaID()
  parentNodeId: PRISMA_ID;
  @Exclude()
  files?: any;
}

export class CreateCommentInputDto extends CreateCommentDto {
  @MaxLength(MAX_LENGTH_COMMENT_CONTENT, {
    message: ERROR_PATCH_CONTENT_COMMENT_TOO_LONG,
  })
  @MinLength(MIN_LENGTH_COMMENT_CONTENT, {
    message: ERROR_PATCH_CONTENT_COMMENT_TOO_SHORT,
  })
  content: string;
}

export class CreateCommentInternalDto extends CreateCommentDto {
  @TransformPrismaID()
  id: PRISMA_ID;
  @ApiProperty({ enum: $Enums.CommentStatus })
  @IsEnum($Enums.CommentStatus)
  status: $Enums.CommentStatus;
}
