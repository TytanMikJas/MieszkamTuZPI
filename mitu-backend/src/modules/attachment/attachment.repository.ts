import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import CreateAttachmentDto from './dto/create-attachment-dto.internal';
import { DeleteAttachmentDto } from './dto/delete-attachment-dto.internal';
import { PRISMA_ID } from 'src/types';
import AttachmentDto from './dto/attachment-dto.internal';

/**
 * Attachment repository
 * @export
 * @class AttachmentRepository
 * @param {PrismaClient} prisma
 * @constructor
 * @method {create} Create attachment
 * @method {delete} Delete attachment
 * @method {getByPostId} Get attachment by post id
 */
@Injectable()
export class AttachmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Create attachment
   * @param {CreateAttachmentDto} body
   * @returns {Promise<void>}
   */
  async create(body: CreateAttachmentDto): Promise<void> {
    await this.prisma.attachment.create({ data: body });
  }

  /**
   * Delete attachment
   * @param {DeleteAttachmentDto} body
   * @returns {Promise<void>}
   */
  async delete(body: DeleteAttachmentDto): Promise<void> {
    await this.prisma.attachment.deleteMany({ where: { ...body } });
  }

  /**
   * Get attachment by post id
   * @param {PRISMA_ID} postId
   * @returns {Promise<AttachmentDto[]>}
   */
  async getByPostId(postId: PRISMA_ID): Promise<AttachmentDto[]> {
    return await this.prisma.attachment.findMany({ where: { postId } });
  }
}
