import { Module } from '@nestjs/common';
import { FilehandlerService } from './filehandler.service';
import { AttachmentModule } from '../attachment/attachment.module';
import FilehandlerController from './filehandler.controller';

/**
 * Filehandler module
 * @export
 * @class Filehandler
 * @module
 * @providers [FilehandlerService]
 * @imports [AttachmentModule]
 * @exports [FilehandlerService]
 */
@Module({
  imports: [AttachmentModule],
  providers: [FilehandlerService],
  exports: [FilehandlerService],
  controllers: [FilehandlerController],
})
export class FilehandlerModule {}
