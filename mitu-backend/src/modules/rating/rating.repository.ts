import { Injectable } from '@nestjs/common';
import { PostVote, PostVoteType, PrismaClient } from '@prisma/client';
import PostVoteCountInternalDto from './dto/post-vote-count-dto.internal';
import { PRISMA_ID } from 'src/types';

/**
 * Repository for the Rating entity
 */
@Injectable()
export default class RatingRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  /**
   * Finds a rating by userId and postId.
   * @param userId - the id of the user
   * @param postId - the id of the post
   * @returns PostVote | null - the rating or null if not found
   */
  async findByUserIdAndPostId(
    userId: number,
    postId: number,
  ): Promise<PostVote | null> {
    const rating = await this.prismaClient.postVote.findFirst({
      where: {
        userId,
        postId,
      },
    });
    return rating;
  }

  /**
   * Finds ratings by userId and multiple postIds.
   * @param userId - the id of the user
   * @param postIds - the ids of the posts
   * @returns PostVote[] - the ratings
   */
  async findByUserIdAndPostIds(
    userId: number,
    postIds: PRISMA_ID[],
  ): Promise<PostVote[]> {
    return await this.prismaClient.postVote.findMany({
      where: {
        userId,
        postId: {
          in: postIds,
        },
      },
    });
  }

  /**
   * Creates a rating for postId by given userId.
   * @param userId - the id of the voting user
   * @param postId - the id of the voted post
   * @param type - the type of the rating, either UPVOTE or DOWNVOTE
   * @returns PostVote - the created rating
   */
  async createByUserIdAndPostId(
    userId: number,
    postId: number,
    type: PostVoteType,
  ): Promise<PostVote> {
    return await this.prismaClient.postVote.create({
      data: {
        userId,
        postId,
        type,
      },
    });
  }

  /**
   * Deletes a rating by userId and postId.
   * @param userId - the id of the user
   * @param postId - the id of the post
   * @returns PostVote - the deleted rating
   */
  async deleteByUserIdAndPostId(
    userId: number,
    postId: number,
  ): Promise<PostVote> {
    return await this.prismaClient.postVote.delete({
      where: {
        userId_postId: {
          postId,
          userId,
        },
      },
    });
  }

  /**
   * Gets the vote count for a post by postId.
   * @param postId - the id of the post
   * @returns PostVoteCountInternalDto - the vote count
   */
  async getVotesCountByPostId(
    postId: PRISMA_ID,
  ): Promise<PostVoteCountInternalDto> {
    const upvoteCount = await this.prismaClient.postVote.count({
      where: {
        postId,
        type: PostVoteType.UPVOTE,
      },
    });
    const downvoteCount = await this.prismaClient.postVote.count({
      where: {
        postId,
        type: PostVoteType.DOWNVOTE,
      },
    });
    return {
      postId,
      upvoteCount,
      downvoteCount,
    };
  }
}
