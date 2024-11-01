import { Injectable } from '@nestjs/common';
import RatingRepository from './rating.repository';
import { PostVote, PostVoteType } from '@prisma/client';
import RatingDto, { RatingType } from './dto/rating-dto';
import { PRISMA_ID } from 'src/types';
import PostVoteCountInternalDto from './dto/post-vote-count-dto.internal';
import { PostService } from '../post/post.service';

@Injectable()
export default class RatingService {
  constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly postService: PostService,
  ) {}
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
      this.postService.incrementUpvoteCount(postId);
      return { postId: postVote.postId, type: RatingType.UPVOTE };
    }
    if (postVote.type === PostVoteType.DOWNVOTE) {
      this.postService.incrementDownvoteCount(postId);
      return { postId: postVote.postId, type: RatingType.DOWNVOTE };
    }
  }

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

  private mapRatingTypeToPostVoteType(type: RatingType): PostVoteType {
    if (type === RatingType.UPVOTE) {
      return PostVoteType.UPVOTE;
    }
    if (type === RatingType.DOWNVOTE) {
      return PostVoteType.DOWNVOTE;
    }
  }

  async getVotesCountByPostId(
    postId: PRISMA_ID,
  ): Promise<PostVoteCountInternalDto> {
    return await this.ratingRepository.getVotesCountByPostId(postId);
  }

  async getVotesByUserIdAndPostIds(
    postId: PRISMA_ID[],
    userId: PRISMA_ID,
  ): Promise<PostVote[]> {
    return await this.ratingRepository.findByUserIdAndPostIds(userId, postId);
  }
}
