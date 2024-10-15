import { Module } from '@nestjs/common';
import { FilehandlerService } from './filehandler.service';
import { AttachmentModule } from '../attachment/attachment.module';

@Module({
  imports: [AttachmentModule],
  providers: [FilehandlerService],
  exports: [FilehandlerService],
})
export class FilehandlerModule {}
