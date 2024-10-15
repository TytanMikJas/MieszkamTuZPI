import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import CreateAttachmentDto from './dto/create-attachment-dto.internal';
import { DeleteAttachmentDto } from './dto/delete-attachment-dto.internal';
import { PRISMA_ID } from 'src/types';
import AttachmentDto from './dto/attachment-dto.internal';

@Injectable()
export class AttachmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(body: CreateAttachmentDto): Promise<void> {
    await this.prisma.attachment.create({ data: body });
  }

  async delete(body: DeleteAttachmentDto): Promise<void> {
    await this.prisma.attachment.deleteMany({ where: { ...body } });
  }

  async getByPostId(postId: PRISMA_ID): Promise<AttachmentDto[]> {
    return await this.prisma.attachment.findMany({ where: { postId } });
  }
}
