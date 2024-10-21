import { PostType } from '@prisma/client';
import { IsEnum, MaxLength } from 'class-validator';
import { MAX_LENGTH_POST_CONTENT } from 'src/max-lengths';
import { ERROR_POST_CONTENT_TOO_LONG } from 'src/strings';

export class CreatePostDto {
  @IsEnum(PostType)
  postType: PostType;
  @MaxLength(MAX_LENGTH_POST_CONTENT, { message: ERROR_POST_CONTENT_TOO_LONG })
  content: string;
  // createdBy: PRISMA_ID; //user id
  thumbnail?: string;
}
