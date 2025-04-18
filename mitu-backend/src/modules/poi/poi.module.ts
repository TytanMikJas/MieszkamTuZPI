import { Module } from '@nestjs/common';
import { PoiService } from './poi.service';
import PoiRepository from './poi.repository';

/**
 * Poi module
 * @export
 * @class PoiModule
 */
@Module({
  imports: [],
  providers: [PoiService, PoiRepository],
  exports: [PoiService, PoiRepository],
})
export class PoiModule {}
