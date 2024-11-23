import { Module } from '@nestjs/common';
import { InvestmentController } from 'src/modules/investment/investment.controller';
import { InvestmentService } from 'src/modules/investment/investment.service';
import InvestmentRepository from 'src/modules/investment/investment.repository';
import { FilehandlerModule } from 'src/modules/filehandler/filehandler.module';
import { PostModule } from 'src/modules/post/post.module';
import { AttachmentModule } from 'src/modules/attachment/attachment.module';
import { PoiModule } from 'src/modules/poi/poi.module';

/**
 * Module for Investment
 * @export
 * @class InvestmentModule
 * @param {FilehandlerModule} FilehandlerModule
 * @param {PostModule} PostModule
 * @param {AttachmentModule} AttachmentModule
 * @param {PoiModule} PoiModule
 * @method {InvestmentController}
 * @method {InvestmentService}
 * @method {InvestmentRepository}
 */
@Module({
  imports: [FilehandlerModule, PostModule, AttachmentModule, PoiModule],
  controllers: [InvestmentController],
  exports: [InvestmentService],
  providers: [InvestmentService, InvestmentRepository],
})
export class InvestmentModule {}
