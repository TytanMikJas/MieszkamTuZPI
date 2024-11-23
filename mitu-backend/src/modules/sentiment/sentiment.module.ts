import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import SentimentService from './sentiment.service';
import SentimentController from './sentiment.controller';
import { AzureSentimentAdapter } from './adapter/azure-sentiment.adapter';
import {
  AzureKeyCredential,
  TextAnalyticsClient,
} from '@azure/ai-text-analytics';
import { PostModule } from '../post/post.module';

@Module({
  imports: [ConfigModule, PostModule],
  providers: [
    {
      useFactory: (config: ConfigService) => {
        const credential = new AzureKeyCredential(
          config.get('AZURE_TEXT_ANALYTICS_KEY'),
        );
        const url = config.get('AZURE_TEXT_ANALYTICS_ENDPOINT');
        return new TextAnalyticsClient(url, credential);
      },
      provide: TextAnalyticsClient,
      inject: [ConfigService],
    },
    SentimentService,
    AzureSentimentAdapter,
  ],
  exports: [SentimentService],
  controllers: [SentimentController],
})
export class SentimentModule {}
