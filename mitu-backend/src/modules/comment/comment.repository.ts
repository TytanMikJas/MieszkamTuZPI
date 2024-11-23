import { Injectable } from '@nestjs/common';
import { $Enums, PrismaClient } from '@prisma/client';
import CommentDto from './dto/comment-dto.output';
import { PRISMA_ID } from 'src/types';
import { GenericFilter } from 'src/query.filter';
import { CreateCommentInternalDto } from './dto/create-comment-dto.input';
import UserInternalDto from '../user/dto/user.internal';

/**
 * Comment repository
 * @description
 * Repository for comment operations
 * @method create
 * @method getAll
 * @method getById
 * @method getByParent
 * @method updateStatus
 * @method delete
 */
@Injectable()
export class CommentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Create a new comment
   * @param body - Comment data
   * @returns CommentDto
   */
  async create(body: CreateCommentInternalDto): Promise<CommentDto> {
    return await this.prisma.comment.create({
      data: { ...body },
    });
  }

  /**
   * Get all comments
   * @param filter - Filter
   * @returns CommentDto[]
   */
  async getAll(filter: GenericFilter): Promise<CommentDto[]> {
    return await this.prisma.comment.findMany({
      skip: filter.skip,
      take: filter.take,
      orderBy: filter.orderBySpecialization,
      where: filter.where,
    });
  }

  /**
   * Get comment by id
   * @param id - Comment id
   * @returns CommentDto
   */
  async getById(id: PRISMA_ID): Promise<CommentDto> {
    return await this.prisma.comment.findUnique({ where: { id } });
  }

  /**
   * Get comments by parent node id
   * @param parentNodeId - Parent node id
   * @param filter - Filter
   * @param user - User
   * @returns CommentDto[]
   */
  async getByParent(
    parentNodeId: PRISMA_ID,
    filter: GenericFilter,
    user: UserInternalDto,
  ): Promise<CommentDto[]> {
    const condition: any = [
      {
        status: $Enums.CommentStatus.APPROVED,
      },
    ];

    if (user) {
      condition.push({
        post: {
          createdById: user.id,
        },
        status: $Enums.CommentStatus.PENDING,
      });
    }

    return await this.prisma.comment.findMany({
      skip: filter.skip,
      take: filter.take,
      orderBy: filter.orderBySpecialization,
      where: {
        parentNodeId,
        OR: condition,
      },
    });
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
    await this.prisma.comment.update({ where: { id }, data: { status } });
  }
}
