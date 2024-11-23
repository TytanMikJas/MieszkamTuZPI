import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentRepository } from './attachment.repository';

/**
 * Attachment module
 * @export
 * @class AttachmentModule
 */
@Module({
  providers: [AttachmentService, AttachmentRepository],
  exports: [AttachmentService],
})
export class AttachmentModule {}
