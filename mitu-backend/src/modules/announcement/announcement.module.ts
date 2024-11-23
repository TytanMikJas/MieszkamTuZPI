import { Module } from '@nestjs/common';
import { AnnouncementController } from 'src/modules/announcement/announcement.controller';
import { AnnouncementService } from 'src/modules/announcement/announcement.service';
import { FilehandlerModule } from 'src/modules/filehandler/filehandler.module';
import { PostModule } from 'src/modules/post/post.module';
import { AttachmentModule } from 'src/modules/attachment/attachment.module';
import AnnouncementRepository from 'src/modules/announcement/announcement.repository';
import { PoiModule } from 'src/modules/poi/poi.module';

/**
 * Module for Announcement
 * @export
 * @class AnnouncementModule
 * @param {FilehandlerModule} filehandlerModule
 * @param {PostModule} postModule
 * @param {AttachmentModule} attachmentModule
 * @param {PoiModule} poiModule
 * @method AnnouncementController
 * @method AnnouncementService
 * @method AnnouncementRepository
 */
@Module({
  imports: [FilehandlerModule, PostModule, AttachmentModule, PoiModule],
  controllers: [AnnouncementController],
  exports: [AnnouncementService],
  providers: [AnnouncementService, AnnouncementRepository],
})
export class AnnouncementModule {}
