import { Injectable } from '@nestjs/common';
import { AttachmentRepository } from './attachment.repository';
import CreateAttachmentDto from './dto/create-attachment-dto.internal';
import { PRISMA_ID } from 'src/types';
import { DeleteAttachmentDto } from './dto/delete-attachment-dto.internal';
import AttachmentDto from './dto/attachment-dto.internal';

/**
 * Attachment service
 * @export
 * @class AttachmentService
 * @param {AttachmentRepository} attachmentRepository
 * @constructor
 * @method {create} Create attachment
 * @method {delete} Delete attachment
 * @method {getByPostId} Get attachment by post id
 */
@Injectable()
export class AttachmentService {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  /**
   * Create attachment
   * @param {CreateAttachmentDto} body
   * @returns {Promise<void>}
   */
  async create(body: CreateAttachmentDto): Promise<void> {
    await this.attachmentRepository.create(body);
  }

  /**
   * Delete attachment
   * @param {DeleteAttachmentDto} body
   * @returns {Promise<void>}
   */
  async delete(body: DeleteAttachmentDto): Promise<void> {
    await this.attachmentRepository.delete(body);
  }

  /**
   * Get attachment by post id
   * @param {PRISMA_ID} postId
   * @returns {Promise<AttachmentDto[]>}
   */
  async getByPostId(postId: PRISMA_ID): Promise<AttachmentDto[]> {
    return await this.attachmentRepository.getByPostId(postId);
  }
}
