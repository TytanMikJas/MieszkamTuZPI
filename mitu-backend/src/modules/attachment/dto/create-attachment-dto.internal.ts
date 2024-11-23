import { PostType, FileType } from '@prisma/client';
import { IsEnum } from 'class-validator';
import TransformPrismaID from 'src/decorators/transformers/prismaid.transformer';
import { PRISMA_ID } from 'src/types';

/**
 * DTO for creating an attachment for a given post
 * @property postId - The ID of the post to delete the attachment from
 * @property fileName - The name of the file to delete
 * @property fileType - The type of the file - {@link FileType}
 * @property postType - The type of the post - {@link PostType}
 * @example
 * ```ts
 * {
 * postId: '123',
 * fileName: 'example.jpg',
 * fileType: FileType.IMAGE,
 * postType: PostType.INVESTMENT
 * }
 */
export default class CreateAttachmentDto {
  @TransformPrismaID()
  postId: PRISMA_ID;
  fileName: string;
  @IsEnum(FileType)
  fileType: FileType;
  @IsEnum(PostType)
  postType: PostType;
}
