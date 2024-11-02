import { Module } from '@nestjs/common';
import { ListingController } from 'src/modules/listing/listing.controller';
import { ListingService } from 'src/modules/listing/listing.service';
import ListingRepository from 'src/modules/listing/listing.repository';
import { FilehandlerModule } from 'src/modules/filehandler/filehandler.module';
import { PostModule } from 'src/modules/post/post.module';
import { AttachmentModule } from 'src/modules/attachment/attachment.module';
import { PoiModule } from 'src/modules/poi/poi.module';

/**
 * Listing module
 * @export
 * @class ListingModule
 */
@Module({
  imports: [FilehandlerModule, PostModule, AttachmentModule, PoiModule],
  controllers: [ListingController],
  exports: [ListingService],
  providers: [ListingService, ListingRepository],
})
export class ListingModule {}
