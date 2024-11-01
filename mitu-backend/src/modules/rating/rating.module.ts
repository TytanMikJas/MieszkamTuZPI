import { Module } from '@nestjs/common';
import RatingController from './rating.controller';
import RatingService from './rating.service';
import RatingRepository from './rating.repository';
import { PostModule } from '../post/post.module';

@Module({
  imports: [PostModule],
  controllers: [RatingController],
  providers: [RatingService, RatingRepository],
  exports: [RatingService],
})
export class RatingModule {}
