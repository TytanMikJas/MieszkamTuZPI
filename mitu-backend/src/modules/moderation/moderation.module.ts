import { Module } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';
import { AzureKeyCredential } from '@azure/core-auth';
import ContentSafetyClient from '@azure-rest/ai-content-safety';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Moderation module
 * @export
 * @class ModerationModule
 */
@Module({
  imports: [ConfigModule, PostModule, CommentModule],
  providers: [
    ModerationService,
    {
      useFactory: (config: ConfigService) => {
        const credentials = new AzureKeyCredential(
          config.get('AZURE_CONTENT_SAFETY_KEY_1'),
        );
        const url = config.get('AZURE_CONTENT_SAFETY_ENDPOINT');
        return ContentSafetyClient(url, credentials);
      },
      provide: 'ContentSafetyClient',
      inject: [ConfigService],
    },
  ],
  exports: [ModerationService],
})
export class ModerationModule {}
