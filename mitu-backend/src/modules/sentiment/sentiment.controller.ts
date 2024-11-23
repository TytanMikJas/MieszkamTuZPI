import { Controller, Get, Param } from '@nestjs/common';
import SentimentService from './sentiment.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { $Enums } from '@prisma/client';
import { PRISMA_ID } from 'src/types';
import CommentablePostSentimentOutputDTO from './dto/commentable-post-dto.output';

/**
 * Sentiment controller
 */
@Controller('sentiment')
@ApiTags('sentiment')
@Roles($Enums.UserRole.OFFICIAL)
export default class SentimentController {
  constructor(private readonly sentimentService: SentimentService) {}

  /**
   * Perform sentiment analysis on a post
   * @param postId
   * @returns
   */
  @Get(':postId')
  async calculateCommentablePostSentiment(
    @Param('postId') postId: PRISMA_ID,
  ): Promise<CommentablePostSentimentOutputDTO> {
    return this.sentimentService.calculateSentiment(postId);
  }
}
