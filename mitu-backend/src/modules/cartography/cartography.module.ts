import { Module } from '@nestjs/common';
import { CartographyController } from './cartography.controller';
import { CartographyService } from './cartography.service';
import { ULDKService } from 'src/modules/uldk/uldk.service';

/**
 * Cartography module
 * @export
 * @class Cartography
 * @param {CartographyController} controllers
 * @param {CartographyService} providers
 * @param {ULDKService} providers
 */
@Module({
  controllers: [CartographyController],
  providers: [CartographyService, ULDKService],
})
export class CartographyModule {}
