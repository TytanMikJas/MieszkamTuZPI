import { forwardRef, Module } from '@nestjs/common';
import RatingController from './rating.controller';
import RatingService from './rating.service';
import RatingRepository from './rating.repository';
import { PostModule } from '../post/post.module';
import { PoiModule } from '../poi/poi.module';

/**
 * Rating module
 * @export
 * @class RatingModule
 */
@Module({
  imports: [forwardRef(() => PostModule), PoiModule],
  controllers: [RatingController],
  providers: [RatingService, RatingRepository],
  exports: [RatingService],
})
export class RatingModule {}
