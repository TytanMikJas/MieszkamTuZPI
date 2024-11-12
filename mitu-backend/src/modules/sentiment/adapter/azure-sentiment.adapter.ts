import { Injectable, Logger } from '@nestjs/common';
import {
  TextAnalyticsClient,
  AnalyzeSentimentSuccessResult,
} from '@azure/ai-text-analytics';

/**
 * Adapter for Azure Sentiment Analysis
 */
@Injectable()
export class AzureSentimentAdapter {
  private log = new Logger(AzureSentimentAdapter.name);
  constructor(private readonly textAnalysisClient: TextAnalyticsClient) {}
  /**
   * Analyze sentiment of a list of text documents
   * @param documents
   */
  async analyzeSentiment(
    documents: string[],
  ): Promise<Array<AnalyzeSentimentSuccessResult>> {
    return this.textAnalysisClient
      .analyzeSentiment(documents, 'pl')
      .then((result) => {
        this.log.debug(result);
        return result as Array<AnalyzeSentimentSuccessResult>;
      })
      .catch((error) => {
        this.log.error(error);
        return [];
      });
  }
}
