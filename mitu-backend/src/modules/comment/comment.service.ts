import { Injectable } from '@nestjs/common';
import { CommentRepository } from 'src/modules/comment/comment.repository';
import { FileExcludeString, PRISMA_ID } from 'src/types';
import CommentDto from 'src/modules/comment/dto/comment-dto.output';
import { GenericFilter } from 'src/query.filter';
import { $Enums } from '@prisma/client';
import { PostService } from 'src/modules/post/post.service';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
import {
  ERROR_COMMENT_NOT_FOUND,
  ERROR_POST_COMMENT,
  FILE_PATHS_IMAGE,
  ERROR_FORBIDDEN,
} from 'src/strings';
import { CreateCommentInputDto } from 'src/modules/comment/dto/create-comment-dto.input';
import { PostFilesGrouped } from 'src/dto/post-files-grouped.internal';
import { FilehandlerService } from 'src/modules/filehandler/filehandler.service';
import UserInternalDto from 'src/modules/user/dto/user.internal';
import { SimpleForbidden } from 'src/exceptions/simple-forbidden.exception';
import { EditCommentOutputDto } from 'src/modules/comment/dto/edit-comment.output';

/**
 * Comment service
 * @description
 * Service for comment operations
 * @method create
 * @method getAll
 * @method getByParent
 * @method updateStatus
 * @method updateContent
 * @method updateFiles
 * @method delete
 *
 */
@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postService: PostService,
    private readonly filehandlerService: FilehandlerService,
  ) {}

  /**
   * Create a new comment
   * @param body - Comment data
   * @param files - Files to be uploaded
   * @param userId - User id
   * @param userRole - User role
   * @returns CommentDto
   */
  async create(
    body: CreateCommentInputDto,
    files: PostFilesGrouped,
    userId: number,
    userRole: $Enums.UserRole,
  ): Promise<CommentDto> {
    const { content, ...commentRest } = body;

    const parentPost = await this.postService.getOne(commentRest.parentNodeId);

    if (!parentPost) throw new SimpleBadRequest(ERROR_POST_COMMENT);

    if (parentPost.postType == $Enums.PostType.COMMENT) {
      const _pc = await this.commentRepository.getById(
        commentRest.parentNodeId,
      );

      if (!_pc) throw new SimpleBadRequest(ERROR_POST_COMMENT);

      if (_pc.status !== $Enums.CommentStatus.APPROVED)
        throw new SimpleBadRequest(ERROR_POST_COMMENT);

      const _pp = await this.postService.getOne(_pc.parentNodeId);
      if (_pp.postType == $Enums.PostType.COMMENT)
        throw new SimpleBadRequest(ERROR_POST_COMMENT);
    }

    const status =
      userRole === $Enums.UserRole.OFFICIAL ||
      userRole === $Enums.UserRole.ADMIN
        ? $Enums.CommentStatus.APPROVED
        : $Enums.CommentStatus.PENDING;

    const post = await this.postService.create(
      {
        postType: $Enums.PostType.COMMENT,
        content,
      },
      userId,
    );
    let comment = null;
    try {
      comment = await this.commentRepository.create({
        ...commentRest,
        id: post.id,
        status: status,
      });
    } catch (e) {
      await this.postService.delete(post.id);
      throw new SimpleBadRequest(ERROR_POST_COMMENT);
    }

    await this.filehandlerService.saveAllPostFiles(
      files,
      $Enums.PostType.COMMENT,
      comment.id,
    );
    const thumbnail =
      files[FILE_PATHS_IMAGE].length > 0
        ? files[FILE_PATHS_IMAGE][0].originalname
        : null;
    if (
      thumbnail &&
      (await this.filehandlerService.canAssignThumbnail(
        comment.id,
        $Enums.PostType.INVESTMENT,
        thumbnail,
        files[FILE_PATHS_IMAGE].reduce(
          (acc, file) => [...acc, file.originalname],
          [],
        ),
      ))
    ) {
      await this.postService.setThumbnail(comment.id, thumbnail);
    }

    if (status === $Enums.CommentStatus.APPROVED)
      await this.postService.incrementComentCount(commentRest.parentNodeId);

    return comment;
  }

  /**
   * Get all comments
   * @param filter - Filter
   * @returns CommentDto[]
   */
  async getAll(filter: GenericFilter): Promise<CommentDto[]> {
    return await this.commentRepository.getAll(filter);
  }

  /**
   * Get comments by parent id
   * @param id - Parent id
   * @param filter - Filter
   * @param user - User
   * @returns CommentDto[]
   */
  async getByParent(
    id: PRISMA_ID,
    filter: GenericFilter,
    user: UserInternalDto,
  ): Promise<CommentDto[]> {
    return await this.commentRepository.getByParent(id, filter, user);
  }

  /**
   * Update comment status
   * @param id - Comment id
   * @param status - New status
   * @returns void
   */
  async updateStatus(
    id: PRISMA_ID,
    status: $Enums.CommentStatus,
  ): Promise<void> {
    const _c = await this.commentRepository.getById(id);
    if (!_c) throw new SimpleBadRequest(ERROR_COMMENT_NOT_FOUND);

    if (
      status === $Enums.CommentStatus.APPROVED &&
      _c.status !== $Enums.CommentStatus.APPROVED
    ) {
      await this.postService.incrementComentCount(_c.parentNodeId);
    }

    await this.commentRepository.updateStatus(id, status);
  }

  /**
   * Update comment content
   * @param id - Comment id
   * @param content - New content
   * @param user - User
   * @returns EditCommentOutputDto
   */
  async updateContent(
    id: PRISMA_ID,
    content: string,
    user: UserInternalDto,
  ): Promise<EditCommentOutputDto> {
    const _c = await this.commentRepository.getById(id);
    if (!_c) throw new SimpleBadRequest(ERROR_COMMENT_NOT_FOUND);

    const _p = await this.postService.getOne(id);
    if (!_p) throw new SimpleBadRequest(ERROR_COMMENT_NOT_FOUND);

    if (user == null || _p.createdById !== user.id) {
      throw new SimpleForbidden(ERROR_FORBIDDEN);
    }

    const result: EditCommentOutputDto = {
      id: _c.id,
      parentNodeId: _c.parentNodeId,
      content: content,
      status: _c.status,
    };

    if (user.role !== $Enums.UserRole.OFFICIAL) {
      await this.commentRepository.updateStatus(
        id,
        $Enums.CommentStatus.PENDING,
      );
      result.status = $Enums.CommentStatus.PENDING;
    }

    await this.postService.setContent(id, content);

    return result;
  }

  /**
   * Update comment files
   * @param id - Comment id
   * @param files - Files
   * @param exclude - Exclude
   * @returns string
   * @description
   * Returns thumbnail name
   **/
  async updateFiles(
    id: PRISMA_ID,
    files: PostFilesGrouped,
    exclude: FileExcludeString,
  ) {
    const _c = await this.commentRepository.getById(id);
    if (!_c) throw new SimpleBadRequest(ERROR_COMMENT_NOT_FOUND);

    const thumbnail =
      files[FILE_PATHS_IMAGE].length > 0
        ? files[FILE_PATHS_IMAGE][0].originalname
        : null;

    const isThumbnailDeleted = await this.filehandlerService.handlePatchedFiles(
      id,
      $Enums.PostType.COMMENT,
      files,
      exclude,
    );

    if (isThumbnailDeleted) await this.postService.setThumbnail(id, '');

    if (
      thumbnail &&
      (await this.filehandlerService.canAssignThumbnail(
        id,
        $Enums.PostType.COMMENT,
        thumbnail,
        files[FILE_PATHS_IMAGE].reduce(
          (acc, file) => [...acc, file.originalname],
          [],
        ),
      ))
    ) {
      await this.postService.setThumbnail(id, thumbnail);
    }

    return thumbnail;
  }

  /**
   * Delete comment
   * @param id - Comment id
   * @param user - User
   * @returns void
   */
  async delete(id: PRISMA_ID, user: UserInternalDto): Promise<void> {
    const _c = await this.commentRepository.getById(id);
    if (!_c) throw new SimpleBadRequest(ERROR_COMMENT_NOT_FOUND);

    const _p = await this.postService.getOne(id);
    if (!_p) throw new SimpleBadRequest(ERROR_COMMENT_NOT_FOUND);

    if (
      user == null ||
      (user.role !== $Enums.UserRole.OFFICIAL && _p.createdById !== user.id)
    ) {
      throw new SimpleForbidden(ERROR_FORBIDDEN);
    }

    await this.postService.decrementComentCount(_c.parentNodeId);
    await this.postService.delete(id);
  }
}
