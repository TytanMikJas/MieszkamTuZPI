import { Injectable } from '@nestjs/common';
import { $Enums, Post, PrismaClient } from '@prisma/client';
import { CreatePostDto } from 'src/modules/post/dto/create-post-dto.internal';
import PostDto, {
  PostDtoWithUser,
} from 'src/modules/post/dto/post-dto.internal';
import { PRISMA_ID } from 'src/types';
import { POST_TAKE_COMMENTS } from 'src/constants';
import { GenericFilter } from 'src/query.filter';

@Injectable()
export default class PostRepository {
  constructor(private readonly prisma: PrismaClient) {}

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

  async getOne(id: PRISMA_ID): Promise<PostDto> {
    return await this.prisma.post.findUnique({ where: { id } });
  }

  async setContent(id: PRISMA_ID, content: string): Promise<PostDto> {
    return await this.prisma.post.update({
      where: { id },
      data: { content },
    });
  }

  async incrementComentCount(id: PRISMA_ID): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { commentCount: { increment: 1 } },
    });
  }

  async decrementComentCount(id: PRISMA_ID): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { commentCount: { decrement: 1 } },
    });
  }

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

  async setThumbnail(id: PRISMA_ID, thumbnail: string): Promise<void> {
    await this.prisma.post.update({ where: { id }, data: { thumbnail } });
  }

  async delete(id: PRISMA_ID): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }

  async bulkDelete(ids: PRISMA_ID[]): Promise<void> {
    await this.prisma.post.deleteMany({ where: { id: { in: ids } } });
  }

  async getPostCommentIds(id: PRISMA_ID): Promise<PRISMA_ID[]> {
    return (
      await this.prisma.comment.findMany({
        where: { parentNodeId: id },
        select: { id: true },
      })
    ).map((c) => c.id);
  }

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

  async getAll(): Promise<Post[]> {
    return await this.prisma.post.findMany();
  }

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
