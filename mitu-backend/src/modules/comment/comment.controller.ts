import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import CommentDto from './dto/comment-dto.output';
import { CreateCommentInputDto } from './dto/create-comment-dto.input';
import { GenericFilter } from 'src/query.filter';
import { $Enums } from '@prisma/client';
import { PostAttributesInterceptor } from '../post/interceptors/postAttributes.interceptor';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { SuccessMessage } from 'src/decorators/success-message/success-message.decorator';
import {
  SUCCESS_HIDE_COMMENT,
  SUCCESS_PATCH_CONTENT_COMMENT,
  SUCCESS_PATCH_FILES_COMMENT,
  SUCCESS_PATCH_STATUS_COMMENT,
  SUCCESS_POST_COMMENT,
} from 'src/strings';
import { UploadedPostFiles } from 'src/decorators/uploaded-post-files/uploaded-post-files.decorator';
import { PostFilesGrouped } from 'src/dto/post-files-grouped.internal';
import { PostListAttributesInterceptor } from '../post/interceptors/postListAttributes.interceptor';
import { FileExcludeString, PRISMA_ID } from 'src/types';
import { ParsePrismaID } from 'src/pipes/parse-prisma-id.pipe';
import { ValidateCommentStatus } from './pipes/validate-comment-status.pipe';
import { ValidateCommentContent } from './pipes/validate-comment-content.pipe';
import { JWTAuthGuard } from '../auth/strategies/jwt.strategy';
import { User } from '../auth/decorators/user.decorator';
import UserInternalDto from '../user/dto/user.internal';
import { IdentifyAuthGuard } from '../auth/strategies/identify.strategy';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/strategies/roles.guard';
import { EditCommentOutputDto } from './dto/edit-comment.output';

/**
 * Comment controller
 * @description
 * Controller for comment operations
 * @method create
 * @method getAll
 * @method getByParent
 * @method updateStatus
 * @method updateContent
 * @method updateFiles
 * @method hide
 */
@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * Create a new comment
   * @param files - Files to be uploaded
   * @param body - Comment data
   * @param user - User
   */
  @Post()
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(PostAttributesInterceptor)
  @UseInterceptors(AnyFilesInterceptor())
  @SuccessMessage(SUCCESS_POST_COMMENT)
  async create(
    @UploadedPostFiles($Enums.PostType.COMMENT) files: PostFilesGrouped,
    @Body() body: CreateCommentInputDto,
    @User() user: UserInternalDto,
  ): Promise<CommentDto> {
    return await this.commentService.create(body, files, user.id, user.role);
  }

  /**
   * Get all comments
   * @param filter - Filter
   * @returns CommentDto[]
   **/
  @Get()
  @Roles($Enums.UserRole.OFFICIAL)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseInterceptors(PostListAttributesInterceptor)
  async getAll(@Query() filter: GenericFilter): Promise<CommentDto[]> {
    return await this.commentService.getAll(filter);
  }

  /**
   * Get comments by parent node id
   * @param id - Parent node id
   * @param filter - Filter
   * @param user - User
   * @returns CommentDto[]
   **/
  @Get('/parent/:id')
  @UseGuards(IdentifyAuthGuard)
  @UseInterceptors(PostListAttributesInterceptor)
  async getByParent(
    @Param('id', ParsePrismaID) id: PRISMA_ID,
    @Query() filter: GenericFilter,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @User() user: UserInternalDto,
  ): Promise<CommentDto[]> {
    return await this.commentService.getByParent(id, filter, user);
  }

  /**
   * Update comment status
   * @param id - Comment id
   * @param status - Comment status
   * @returns void
   * */
  @Patch('/status/:id')
  @Roles($Enums.UserRole.OFFICIAL)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @SuccessMessage(SUCCESS_PATCH_STATUS_COMMENT)
  @ApiQuery({ name: 'status', enum: $Enums.CommentStatus })
  async updateStatus(
    @Param('id', ParsePrismaID) id: PRISMA_ID,
    @Query('status', ValidateCommentStatus)
    status: $Enums.CommentStatus,
  ): Promise<void> {
    return await this.commentService.updateStatus(id, status);
  }

  /**
   * Update comment content
   * @param id - Comment id
   * @param content - New content
   * @param user - User
   * @returns EditCommentOutputDto
   * */
  @Patch('/content/:id')
  @UseGuards(JWTAuthGuard)
  @SuccessMessage(SUCCESS_PATCH_CONTENT_COMMENT)
  async updateContent(
    @Param('id', ParsePrismaID)
    id: PRISMA_ID,
    @Query('content', ValidateCommentContent)
    content: string,
    @User() user: UserInternalDto,
  ): Promise<EditCommentOutputDto> {
    return await this.commentService.updateContent(id, content, user);
  }

  /**
   * Update comment files
   * @param id - Comment id
   * @param files - Files
   * @param exclude - Exclude
   * */
  @Patch('/files/:id')
  @Roles($Enums.UserRole.OFFICIAL)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @UseInterceptors(AnyFilesInterceptor())
  @SuccessMessage(SUCCESS_PATCH_FILES_COMMENT)
  async updateFiles(
    @Param('id', ParsePrismaID) id: PRISMA_ID,
    @UploadedPostFiles($Enums.PostType.COMMENT) files: PostFilesGrouped,
    @Body('exclude') exclude: FileExcludeString,
  ) {
    return await this.commentService.updateFiles(id, files, exclude);
  }

  /**
   * Hide a comment
   * @param id - Comment id
   * @param user - User
   * */
  @Delete('/one/:id')
  @UseGuards(JWTAuthGuard)
  @SuccessMessage(SUCCESS_HIDE_COMMENT)
  async hide(
    @Param('id', ParsePrismaID) id: PRISMA_ID,
    @User() user: UserInternalDto,
  ): Promise<void> {
    return await this.commentService.delete(id, user);
  }
}
