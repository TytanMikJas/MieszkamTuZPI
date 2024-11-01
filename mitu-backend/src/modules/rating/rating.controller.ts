import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import UserInternalDto from '../user/dto/user.internal';
import RatingService from './rating.service';
import { JWTAuthGuard } from '../auth/strategies/jwt.strategy';
import { SuccessMessage } from 'src/decorators/success-message/success-message.decorator';
import RatingDto, { RatingType } from './dto/rating-dto';
import { SUCCESS_POST_RATING } from 'src/strings';
import { ParsePrismaID } from 'src/pipes/parse-prisma-id.pipe';
import { User } from '../auth/decorators/user.decorator';
import { ApiTags } from '@nestjs/swagger';

/**
 * Controller for the Rating entity
 */
@ApiTags('rating')
@Controller('rating')
@ApiTags('rating')
@UseGuards(JWTAuthGuard)
export default class RatingController {
  constructor(private readonly ratingService: RatingService) {
    this.ratingService = ratingService;
  }

  /**
   * Upvotes a post with the given postId. Requires a logged in user.
   * If the post is already upvoted by the user, the upvote is removed.
   * If the post is downvoted by the user, the downvote is removed and the post is upvoted.
   * @param postId - the id of the post
   * @param user - logged in user
   * @returns RatingDto - the updated rating of the post
   */
  @Post('upvote/:postId')
  @UseGuards(JWTAuthGuard)
  @SuccessMessage(SUCCESS_POST_RATING)
  async upvote(
    @Param('postId', ParsePrismaID) postId: number,
    @User() user: UserInternalDto,
  ): Promise<RatingDto> {
    return await this.ratingService.performVote(
      RatingType.UPVOTE,
      RatingType.DOWNVOTE,
      user.id,
      postId,
    );
  }

  /**
   * Downvotes a post with the given postId. Requires a logged in user.
   * If the post is already downvoted by the user, the downvote is removed.
   * If the post is upvoted by the user, the upvote is removed and the post is downvoted.
   * @param postId - the id of the post
   * @param user - logged in user
   * @returns RatingDto - the updated rating of the post
   */
  @Post('downvote/:postId')
  @UseGuards(JWTAuthGuard)
  @SuccessMessage(SUCCESS_POST_RATING)
  async downvote(
    @Param('postId', ParsePrismaID) postId: number,
    @User() user: UserInternalDto,
  ): Promise<RatingDto> {
    return await this.ratingService.performVote(
      RatingType.DOWNVOTE,
      RatingType.UPVOTE,
      user.id,
      postId,
    );
  }
}
