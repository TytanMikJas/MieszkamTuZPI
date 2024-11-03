import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from 'src/modules/post/dto/create-post-dto.internal';
import PostRepository from 'src/modules/post/post.repository';
import { PRISMA_ID } from 'src/types';
import PostDto from 'src/modules/post/dto/post-dto.internal';
import PostAttributesDto from 'src/modules/post/dto/post-attributes-dto-internal';
import { SimpleNotFound } from 'src/exceptions/simple-not-found.exception';
import { ERROR_POST_NOT_FOUND } from 'src/strings';
import { FilehandlerService } from 'src/modules/filehandler/filehandler.service';
import { GenericFilter } from 'src/query.filter';
import { $Enums } from '@prisma/client';
import { RatingType } from '../rating/dto/rating-dto';
import RatingService from '../rating/rating.service';
import UserInternalDto from '../user/dto/user.internal';

/**
 * Service for the Post entity
 */
@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly filehandlerService: FilehandlerService,
    private readonly ratingService: RatingService,
  ) {}
  private readonly logger = new Logger(PostService.name);

  async create(body: CreatePostDto, userId: PRISMA_ID): Promise<PostDto> {
    const _p = await this.postRepository.create(body, userId);

    try {
      await this.filehandlerService.preparePostDirectories(
        body.postType,
        _p.id,
      );
    } catch (e) {
      await this.postRepository.delete(_p.id);
      throw e;
    }

    return _p;
  }

  async setContent(id: PRISMA_ID, content: string): Promise<PostDto> {
    const _p = await this.postRepository.getOne(id);

    if (!_p) throw new SimpleNotFound(ERROR_POST_NOT_FOUND);

    return await this.postRepository.setContent(id, content);
  }

  async incrementComentCount(id: PRISMA_ID): Promise<void> {
    const _p = await this.postRepository.getOne(id);

    if (!_p) throw new SimpleNotFound(ERROR_POST_NOT_FOUND);
    return await this.postRepository.incrementComentCount(id);
  }

  async decrementComentCount(id: PRISMA_ID): Promise<void> {
    const _p = await this.postRepository.getOne(id);

    if (!_p) throw new SimpleNotFound(ERROR_POST_NOT_FOUND);
    return await this.postRepository.decrementComentCount(id);
  }

  async incrementUpvoteCount(id: PRISMA_ID): Promise<void> {
    const _p = await this.postRepository.getOne(id);

    if (!_p) throw new SimpleNotFound(ERROR_POST_NOT_FOUND);
    return await this.postRepository.incrementUpvoteCount(id);
  }

  async decrementUpvoteCount(id: PRISMA_ID): Promise<void> {
    const _p = await this.postRepository.getOne(id);

    if (!_p) throw new SimpleNotFound(ERROR_POST_NOT_FOUND);
    return await this.postRepository.decrementUpvoteCount(id);
  }

  async incrementDownvoteCount(id: PRISMA_ID): Promise<void> {
    const _p = await this.postRepository.getOne(id);

    if (!_p) throw new SimpleNotFound(ERROR_POST_NOT_FOUND);
    return await this.postRepository.incrementDownvoteCount(id);
  }

  async decrementDownvoteCount(id: PRISMA_ID): Promise<void> {
    const _p = await this.postRepository.getOne(id);

    if (!_p) throw new SimpleNotFound(ERROR_POST_NOT_FOUND);
    return await this.postRepository.decrementDownvoteCount(id);
  }

  async getOne(id: PRISMA_ID): Promise<PostDto> {
    const _p = await this.postRepository.getOne(id);

    if (!_p) throw new SimpleNotFound(ERROR_POST_NOT_FOUND);

    return _p;
  }

  async setThumbnail(id: PRISMA_ID, thumbnail: string): Promise<void> {
    await this.postRepository.setThumbnail(
      id,
      this.filehandlerService.transformOriginalnameToFormat(thumbnail),
    );
  }

  async getAttributes(
    ids: PRISMA_ID[],
    user?: UserInternalDto,
  ): Promise<PostAttributesDto[]> {
    const _posts = await this.postRepository.getManyByIds(ids);
    if (_posts.length != ids.length)
      throw new SimpleNotFound(ERROR_POST_NOT_FOUND);
    const ratings = {};
    if (user) {
      const _ratings = await this.ratingService.getVotesByUserIdAndPostIds(
        ids,
        user.id,
      );
      _ratings.map((r) => {
        ratings[r.postId] = r;
      });
    }

    const attributes = _posts.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ comments, ...rest }) => rest,
    );

    attributes.map((a) => {
      if (ratings[a.id]) {
        a.personalRating = ratings[a.id].type;
      } else {
        a.personalRating = RatingType.NOVOTE;
      }
    });

    return attributes;
  }

  async delete(id: PRISMA_ID): Promise<void> {
    const _p = await this.postRepository.getOne(id);

    if (!_p) throw new SimpleNotFound(ERROR_POST_NOT_FOUND);

    const commentsIds = await this.postRepository.getPostCommentIds(id);

    //deleting comments
    commentsIds.map(async (commentId) => {
      await this.filehandlerService.deletePostDirectory(
        $Enums.PostType.COMMENT,
        commentId,
      );
      //delete POST_comments with their attachments
      //(COMMENT_comments are deleted automatically by Cascade rule in prisma schema)
      await this.delete(commentId);
    });

    //deleting post, postSpec + attachments
    await this.postRepository.delete(id);

    //deleting post directory
    await this.filehandlerService.deletePostDirectory(_p.postType, id);
  }

  async sortIds(
    genericFilter: GenericFilter,
    postType: $Enums.PostType,
  ): Promise<number[]> {
    return await this.postRepository.sortIds(genericFilter, postType);
  }

  async sortPosts<T extends Specialization>(
    specialization: T[],
    genericFilter: GenericFilter,
    postType: $Enums.PostType,
  ): Promise<T[]> {
    const sortedIds: number[] = await this.sortIds(genericFilter, postType);
    const sortedInvestments: T[] = [];

    let skipCounter = 0;
    for (const id of sortedIds) {
      const investment = specialization.find((s) => s.id === id);
      if (investment) {
        if (skipCounter < genericFilter.skip) {
          skipCounter++;
        } else {
          sortedInvestments.push(investment);
          if (sortedInvestments.length === genericFilter.take) {
            break;
          }
        }
      }
    }
    return sortedInvestments;
  }
}

class Specialization {
  id: number;
}
