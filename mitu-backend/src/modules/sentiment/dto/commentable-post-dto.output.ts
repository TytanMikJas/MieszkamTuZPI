/**
 * CommentablePostSentimentOutputDTO is a data transfer object that represents the sentiment analysis output of a post with comments with top rated positive and negative comments.
 */
export default class CommentablePostSentimentOutputDTO {
  sentiment: SentimentInfo;
  topPositiveComments: CommentSentimentOutputDTO[];
  topNegativeComments: CommentSentimentOutputDTO[];
}

/**
 * SentimentInfo is a data transfer object that represents the sentiment analysis output of a post with comments.
 */
export class SentimentInfo {
  positive: number;
  negative: number;
  neutral: number;
  mixed: number;
  description: SentimentDescription;
}

/**
 * CommentSentimentOutputDTO is a data transfer object that represents single comment text and id.
 */
export class CommentSentimentOutputDTO {
  commentId: string;
  text: string;
}

/**
 * SentimentDescription is an enum that represents the sentiment description.
 */
export enum SentimentDescription {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
  MIXED = 'mixed',
}
