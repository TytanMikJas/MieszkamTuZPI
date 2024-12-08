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
    const batches = [];
    const batchSize = 10;
    let nBatches;
    if (documents.length % batchSize == 0) {
      nBatches = Math.floor(documents.length / batchSize);
    } else {
      nBatches = Math.floor(documents.length / batchSize) + 1;
    }
    let counter = 0;
    for (let j = 0; j < nBatches; j++) {
      batches.push([]);
      for (let i = 0; i < batchSize && counter < documents.length; i++) {
        batches[j].push(documents[counter]);
        counter++;
      }
    }
    const res = [];
    for (let i = 0; i < nBatches; i++) {
      const partialRes = await this.textAnalysisClient
        .analyzeSentiment(batches[i], 'pl')
        .then((result) => {
          this.log.debug(result);
          return result as Array<AnalyzeSentimentSuccessResult>;
        })
        .catch((error) => {
          this.log.error(error);
          return [] as Array<AnalyzeSentimentSuccessResult>;
        });

      const mappedIndexPartialRes = partialRes.map((res) => ({
        ...res,
        id: Number(res.id) + batchSize * i,
      }));
      res.push(mappedIndexPartialRes);
    }

    return res.flat();
  }
}
