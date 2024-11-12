import { forwardRef, Inject, Injectable } from '@nestjs/common';
import RatingRepository from './rating.repository';
import { PostVote, PostVoteType } from '@prisma/client';
import RatingDto, { RatingType } from './dto/rating-dto';
import { PRISMA_ID } from 'src/types';
import PostVoteCountInternalDto from './dto/post-vote-count-dto.internal';
import { PostService } from '../post/post.service';

/**
 * Rating service
 * @export
 * @class RatingService
 * @param {RatingRepository} ratingRepository
 * @param {PostService} postService
 * @method {findByUserIdAndPostId} Find rating by user id and post id
 * @method {createByUserIdAndPostId} Create rating by user id and post id
 * @method {deleteByUserIdAndPostId} Delete rating by user id and post id
 * @method {performVote} Perform vote
 */
@Injectable()
export default class RatingService {
  /**
   * Creates an instance of RatingService.
   * @param {RatingRepository} ratingRepository
   * @param {PostService} postService
   * @memberof RatingService
   * */
  constructor(
    private readonly ratingRepository: RatingRepository,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  /**
   * Find rating by user id and post id
   * @param {number} userId
   * @param {number} postId
   * @returns {Promise<RatingDto>}
   */
  private async findByUserIdAndPostId(
    userId: number,
    postId: number,
  ): Promise<RatingDto> {
    const rating = await this.ratingRepository.findByUserIdAndPostId(
      userId,
      postId,
    );
    if (!rating) {
      return { postId: postId, type: RatingType.NOVOTE };
    }
    if (rating.type === PostVoteType.UPVOTE) {
      return { postId: postId, type: RatingType.UPVOTE };
    }
    if (rating.type === PostVoteType.DOWNVOTE) {
      return { postId: postId, type: RatingType.DOWNVOTE };
    }
  }

  /**
   * Create rating by user id and post id
   * @param {number} userId
   * @param {number} postId
   * @param {PostVoteType} type
   * @returns {Promise<RatingDto>}
   */
  private async createByUserIdAndPostId(
    userId: number,
    postId: number,
    type: PostVoteType,
  ): Promise<RatingDto> {
    const postVote = await this.ratingRepository.createByUserIdAndPostId(
      userId,
      postId,
      type,
    );
    if (postVote.type === PostVoteType.UPVOTE) {
      await this.postService.incrementUpvoteCount(postId);
      return { postId: postVote.postId, type: RatingType.UPVOTE };
    }
    if (postVote.type === PostVoteType.DOWNVOTE) {
      await this.postService.incrementDownvoteCount(postId);
      return { postId: postVote.postId, type: RatingType.DOWNVOTE };
    }
  }

  /**
   * Delete rating by user id and post id
   * @param {number} userId
   * @param {number} postId
   * @returns {Promise<RatingDto>}
   */
  private async deleteByUserIdAndPostId(
    userId: number,
    postId: number,
  ): Promise<RatingDto> {
    const deletedRating: PostVote =
      await this.ratingRepository.deleteByUserIdAndPostId(userId, postId);
    if (deletedRating.type === PostVoteType.UPVOTE) {
      this.postService.decrementUpvoteCount(postId);
    }
    if (deletedRating.type === PostVoteType.DOWNVOTE) {
      this.postService.decrementDownvoteCount(postId);
    }
    return { postId: postId, type: RatingType.NOVOTE };
  }

  /**
   * Perform vote
   * @param {RatingType} desiredVote
   * @param {RatingType} contrVote
   * @param {number} userId
   * @param {number} postId
   * @returns {Promise<RatingDto>}
   */
  async performVote(
    desiredVote: RatingType,
    contrVote: RatingType,
    userId: PRISMA_ID,
    postId: PRISMA_ID,
  ): Promise<RatingDto> {
    const rating: RatingDto = await this.findByUserIdAndPostId(userId, postId);

    if (rating.type === desiredVote) {
      await this.deleteByUserIdAndPostId(userId, postId);
      return { postId, type: RatingType.NOVOTE };
    }

    if (rating.type === contrVote) {
      await this.deleteByUserIdAndPostId(userId, postId);
      await this.createByUserIdAndPostId(
        userId,
        postId,
        this.mapRatingTypeToPostVoteType(desiredVote),
      );
      return { postId, type: desiredVote };
    }

    if (rating.type === RatingType.NOVOTE) {
      await this.createByUserIdAndPostId(
        userId,
        postId,
        this.mapRatingTypeToPostVoteType(desiredVote),
      );
      return { postId, type: desiredVote };
    }
  }

  /**
   * Map rating type to post vote type
   * @param {RatingType} type
   * @returns {PostVoteType}
   */
  private mapRatingTypeToPostVoteType(type: RatingType): PostVoteType {
    if (type === RatingType.UPVOTE) {
      return PostVoteType.UPVOTE;
    }
    if (type === RatingType.DOWNVOTE) {
      return PostVoteType.DOWNVOTE;
    }
  }

  /**
   * Get votes count by post id
   * @param {number} postId
   * @returns {Promise<PostVoteCountInternalDto>}
   */
  async getVotesCountByPostId(
    postId: PRISMA_ID,
  ): Promise<PostVoteCountInternalDto> {
    return await this.ratingRepository.getVotesCountByPostId(postId);
  }

  /**
   * Get votes by user id and post ids
   * @param {number[]} postId
   * @param {number} userId
   * @returns {Promise<PostVote[]>}
   */
  async getVotesByUserIdAndPostIds(
    postId: PRISMA_ID[],
    userId: PRISMA_ID,
  ): Promise<PostVote[]> {
    return await this.ratingRepository.findByUserIdAndPostIds(userId, postId);
  }
}
