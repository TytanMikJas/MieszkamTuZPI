import { Injectable } from '@nestjs/common';
import { PRISMA_ID } from 'src/types';
import CommentablePostSentimentOutputDTO, {
  CommentSentimentOutputDTO,
  SentimentDescription,
} from './dto/commentable-post-dto.output';
import { AzureSentimentAdapter } from './adapter/azure-sentiment.adapter';
import { PostService } from '../post/post.service';

@Injectable()
export default class SentimentService {
  constructor(
    private readonly azureSentimentAdapter: AzureSentimentAdapter,
    private readonly postService: PostService,
  ) {}

  async calculateSentiment(
    id: PRISMA_ID,
    numberOfTopPositive: number = 3,
    numberOfTopNegative: number = 3,
  ): Promise<CommentablePostSentimentOutputDTO> {
    const post = await this.postService.getPostCommentsContentInternalDto(id);
    const testTexts = post.comments.map((comment) => comment.content);
    const analysis =
      await this.azureSentimentAdapter.analyzeSentiment(testTexts);
    const positiveSortedByPositiveDesc = analysis
      .filter((analysis) => analysis.sentiment === 'positive')
      .sort(
        (a, b) => b.confidenceScores.positive - a.confidenceScores.positive,
      );
    const negativeSortedByNegativeDesc = analysis
      .filter((analysis) => analysis.sentiment === 'negative')
      .sort(
        (a, b) => b.confidenceScores.negative - a.confidenceScores.negative,
      );

    const top3Positive: CommentSentimentOutputDTO[] =
      positiveSortedByPositiveDesc
        .slice(
          0,
          Math.min(numberOfTopPositive, positiveSortedByPositiveDesc.length),
        )
        .map((analysis) => ({
          commentId: analysis.id,
          text: testTexts[analysis.id],
        }));

    const top3Negative: CommentSentimentOutputDTO[] =
      negativeSortedByNegativeDesc
        .slice(
          0,
          Math.min(numberOfTopNegative, negativeSortedByNegativeDesc.length),
        )
        .map((analysis) => ({
          commentId: analysis.id,
          text: testTexts[analysis.id],
        }));
    const countPositive = analysis.filter(
      (analysis) => analysis.sentiment === 'positive',
    ).length;

    const countNegative = analysis.filter(
      (analysis) => analysis.sentiment === 'negative',
    ).length;

    const countNeutral = analysis.filter(
      (analysis) => analysis.sentiment === 'neutral',
    ).length;

    const countMixed = analysis.filter(
      (analysis) => analysis.sentiment === 'mixed',
    ).length;

    //if no statistics is higher than others by alpha, then it is mixed
    const alpha = 1.1;
    let sentimentDescription: SentimentDescription;
    if (
      countPositive * alpha > countNegative &&
      countPositive * alpha > countNeutral &&
      countPositive * alpha > countMixed
    ) {
      sentimentDescription = SentimentDescription.POSITIVE;
    } else if (
      countNegative * alpha > countPositive &&
      countNegative * alpha > countNeutral &&
      countNegative * alpha > countMixed
    ) {
      sentimentDescription = SentimentDescription.NEGATIVE;
    } else if (
      countNeutral * alpha > countPositive &&
      countNeutral * alpha > countNegative &&
      countNeutral * alpha > countMixed
    ) {
      sentimentDescription = SentimentDescription.NEUTRAL;
    } else {
      sentimentDescription = SentimentDescription.MIXED;
    }
    return {
      sentiment: {
        description: sentimentDescription,
        negative: countNegative,
        neutral: countNeutral,
        positive: countPositive,
        mixed: countMixed,
      },
      topNegativeComments: top3Negative,
      topPositiveComments: top3Positive,
    };
  }
}
