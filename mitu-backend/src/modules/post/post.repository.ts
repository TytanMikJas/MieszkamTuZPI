import { Injectable } from '@nestjs/common';
import { $Enums, Post, PrismaClient } from '@prisma/client';
import { CreatePostDto } from 'src/modules/post/dto/create-post-dto.internal';
import PostDto, {
  PostDtoWithUser,
} from 'src/modules/post/dto/post-dto.internal';
import { PRISMA_ID } from 'src/types';
import { POST_TAKE_COMMENTS } from 'src/constants';
import { GenericFilter } from 'src/query.filter';
/**
 * Repository for the Post entity
 */
@Injectable()
export default class PostRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Properties of the user that are visible to the client
   */
  private visibleUserProps = {
    createdBy: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        email: true,
      },
    },
  };

  /**
   * Decrement the downvote count of a post
   * @param {number} id - The ID of the post
   */
  async decrementDownvoteCount(id: PRISMA_ID): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { downvoteCount: true },
    });
    await this.prisma.post.update({
      where: { id },
      data: { downvoteCount: { set: post.downvoteCount - 1 } },
    });
  }

  /**
   * Increment the downvote count of a post
   * @param {number} id - The ID of the post
   */
  async incrementDownvoteCount(id: PRISMA_ID): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { downvoteCount: true },
    });
    await this.prisma.post.update({
      where: { id },
      data: { downvoteCount: { set: post.downvoteCount + 1 } },
    });
  }

  /**
   * Decrement the upvote count of a post
   * @param {number} id - The ID of the post
   */
  async decrementUpvoteCount(id: PRISMA_ID): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { upvoteCount: true },
    });
    await this.prisma.post.update({
      where: { id },
      data: { upvoteCount: { set: post.upvoteCount - 1 } },
    });
  }

  /**
   * Increment the upvote count of a post
   * @param {number} id - The ID of the post
   */
  async incrementUpvoteCount(id: PRISMA_ID): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { upvoteCount: true },
    });
    await this.prisma.post.update({
      where: { id },
      data: { upvoteCount: { set: post.upvoteCount + 1 } },
    });
  }

  /**
   * Create a new post
   * @param {CreatePostDto} body - The post DTO
   * @param {PRISMA_ID} userId - The user ID
   * @returns {Promise<PostDto>} - The post DTO
   */
  async create(body: CreatePostDto, userId: PRISMA_ID): Promise<PostDto> {
    return await this.prisma.post.create({
      data: {
        ...body,
        createdBy: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  /**
   * Get a post by its ID
   * @param {number} id - The ID of the post
   * @returns {Promise<PostDto>} - The post DTO
   */
  async getOne(id: PRISMA_ID): Promise<PostDto> {
    return await this.prisma.post.findUnique({ where: { id } });
  }

  /**
   * Get a post by its ID with the user who created it
   * @param {number} id - The ID of the post
   * @returns {Promise<PostDtoWithUser>} - The post DTO
   */
  async setContent(id: PRISMA_ID, content: string): Promise<PostDto> {
    return await this.prisma.post.update({
      where: { id },
      data: { content },
    });
  }

  /**
   * Get a post by its ID with the user who created it
   * @param {number} id - The ID of the post
   * @returns {Promise<PostDtoWithUser>} - The post DTO
   */
  async incrementComentCount(id: PRISMA_ID): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { commentCount: { increment: 1 } },
    });
  }

  /**
   * Get a post by its ID with the user who created it
   * @param {number} id - The ID of the post
   * @returns {Promise<PostDtoWithUser>} - The post DTO
   */
  async decrementComentCount(id: PRISMA_ID): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { commentCount: { decrement: 1 } },
    });
  }

  /**
   * Get a post by its ID with the user who created it
   * @param {number} id - The ID of the post
   * @returns {Promise<PostDtoWithUser>} - The post DTO
   */
  async getManyByIds(ids: PRISMA_ID[]): Promise<PostDtoWithUser[]> {
    const posts = [];
    // Can't use findMany, because it destroys the order
    for (const id of ids) {
      const post = await this.prisma.post.findUnique({
        where: { id },
        include: {
          attachments: true,
          createdBy: true,
          comments: {
            take: POST_TAKE_COMMENTS,
          },
          ...this.visibleUserProps,
        },
      });
      posts.push(post);
    }
    return posts as unknown as PostDtoWithUser[];
  }

  /**
   * Get a post by its ID with the user who created it
   * @param {number} id - The ID of the post
   * @returns {Promise<PostDtoWithUser>} - The post DTO
   */
  async setThumbnail(id: PRISMA_ID, thumbnail: string): Promise<void> {
    await this.prisma.post.update({ where: { id }, data: { thumbnail } });
  }

  /**
   * Get a post by its ID with the user who created it
   * @param {number} id - The ID of the post
   * @returns {Promise<PostDtoWithUser>} - The post DTO
   */
  async delete(id: PRISMA_ID): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }

  /**
   * Get a post by its ID with the user who created it
   * @param {number} id - The ID of the post
   * @returns {Promise<PostDtoWithUser>} - The post DTO
   */
  async bulkDelete(ids: PRISMA_ID[]): Promise<void> {
    await this.prisma.post.deleteMany({ where: { id: { in: ids } } });
  }

  /**
   * Get a post by its ID with the user who created it
   * @param {number} id - The ID of the post
   * @returns {Promise<PostDtoWithUser>} - The post DTO
   */
  async getPostCommentIds(id: PRISMA_ID): Promise<PRISMA_ID[]> {
    return (
      await this.prisma.comment.findMany({
        where: { parentNodeId: id },
        select: { id: true },
      })
    ).map((c) => c.id);
  }

  /**
   * Get a post by its ID with the user who created it
   * @param {number} id - The ID of the post
   * @returns {Promise<PostDtoWithUser>} - The post DTO
   */
  async updateVotes(
    id: number,
    upvoteCount: number,
    downvoteCount: number,
  ): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { upvoteCount, downvoteCount },
    });
  }

  /**
   * Get all posts
   * @returns {Promise<Post[]>}
   */
  async getAll(): Promise<Post[]> {
    return await this.prisma.post.findMany();
  }

  /**
   * Get all posts
   * @returns {Promise<Post[]>}
   */
  async sortIds(genericFilter: GenericFilter, postType: $Enums.PostType) {
    const posts = await this.prisma.post.findMany({
      where: {
        postType: {
          equals: postType,
        },
      },
      orderBy: genericFilter.orderByPost,
    });
    return posts.map((p) => p.id);
  }
}
