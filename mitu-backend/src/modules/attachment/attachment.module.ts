import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentRepository } from './attachment.repository';

@Module({
  providers: [AttachmentService, AttachmentRepository],
  exports: [AttachmentService],
})
export class AttachmentModule {}
