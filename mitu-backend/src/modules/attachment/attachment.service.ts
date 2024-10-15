import { Injectable } from '@nestjs/common';
import { AttachmentRepository } from './attachment.repository';
import CreateAttachmentDto from './dto/create-attachment-dto.internal';
import { PRISMA_ID } from 'src/types';
import { DeleteAttachmentDto } from './dto/delete-attachment-dto.internal';
import AttachmentDto from './dto/attachment-dto.internal';

@Injectable()
export class AttachmentService {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async create(body: CreateAttachmentDto): Promise<void> {
    await this.attachmentRepository.create(body);
  }

  async delete(body: DeleteAttachmentDto): Promise<void> {
    await this.attachmentRepository.delete(body);
  }

  async getByPostId(postId: PRISMA_ID): Promise<AttachmentDto[]> {
    return await this.attachmentRepository.getByPostId(postId);
  }
}
