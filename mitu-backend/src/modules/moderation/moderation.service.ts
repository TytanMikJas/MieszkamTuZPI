import { Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { TEN_MINUTES_MODERATION_INTERVAL } from 'src/constants';
import { PostService } from '../post/post.service';
import PostModerateDto from '../post/dto/post-moderate-dto.internal';
import { CommentService } from '../comment/comment.service';
import { CommentStatus } from '@prisma/client';
import {
  ContentSafetyClient,
  isUnexpected,
} from '@azure-rest/ai-content-safety';
import { URL_PREFIX, URL_POSTFIX, AZURE_BLOCKLIST_NAME } from 'src/strings';

/**
 * Comments moderation service
 * @export
 * @class ModerationService
 * @constructor
 */
@Injectable()
export class ModerationService {
  /**
   * Creates an instance of ModerationService.
   * @param {PostService} postService - The post service
   * @param {CommentService} commentService - The comment service
   * @param {ContentSafetyClient} contentSafetyClient - The content safety client
   */
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    @Inject('ContentSafetyClient')
    private readonly contentSafetyClient: ContentSafetyClient,
  ) {}

  /**
   * Moderate comments
   * @memberof ModerationService
   * @method moderateComments
   */
  @Interval(TEN_MINUTES_MODERATION_INTERVAL)
  async moderateComments() {
    const pendingComments: PostModerateDto[] =
      await this.postService.getAllPendingComments();

    await Promise.all(
      pendingComments.map(async (comment) => {
        const isSafe = await this.isCommentSafe(
          comment.id,
          comment.content,
          comment.thumbnail,
        );
        if (isSafe) {
          await this.commentService.updateStatus(
            comment.id,
            CommentStatus.APPROVED,
          );
        } else {
          await this.postService.delete(comment.id);
        }
      }),
    );
  }

  private async isCommentSafe(
    id: number,
    content: string,
    thumbnail?: string,
  ): Promise<boolean> {
    const isContentSafe = await this.isContentSafe(content);
    const isThumbnailSafe = await this.isThumbnailSafe(id, thumbnail);
    return isContentSafe && isThumbnailSafe;
  }

  private async isContentSafe(content: string): Promise<boolean> {
    const response = await this.contentSafetyClient.path('/text:analyze').post({
      body: {
        text: content,
        outputType: 'EightSeverityLevels',
        blocklistNames: [AZURE_BLOCKLIST_NAME],
        haltOnBlocklistHit: true,
      },
    });

    if (
      isUnexpected(response) ||
      response.body.categoriesAnalysis.length === 0
    ) {
      console.log('rejected');
      return false;
    }

    return response.body.categoriesAnalysis.every(
      (analysis) => analysis.severity <= 2,
    );
  }

  private async isThumbnailSafe(
    id: number,
    thumbnail?: string,
  ): Promise<boolean> {
    if (!thumbnail || process.env.SERVICE_DOMAIN === undefined) return true;
    const imageUrl =
      process.env.SERVICE_DOMAIN + URL_PREFIX + id + URL_POSTFIX + thumbnail;

    const analyzeImageOption = { image: { blobUrl: imageUrl } };
    const analyzeImageParameters = { body: analyzeImageOption };

    const response = await this.contentSafetyClient
      .path('/image:analyze')
      .post(analyzeImageParameters);

    if (isUnexpected(response)) {
      return false;
    }

    return response.body.categoriesAnalysis.every(
      (analysis) => analysis.severity <= 2,
    );
  }
}
