export default interface CommentablePostSentimentOutputDTO {
  sentiment: SentimentInfo;
  topPositiveComments: CommentSentimentOutputDTO[];
  topNegativeComments: CommentSentimentOutputDTO[];
}

export interface SentimentInfo {
  positive: number;
  negative: number;
  neutral: number;
  mixed: number;
  description: SentimentDescription;
}

export interface CommentSentimentOutputDTO {
  commentId: string;
  text: string;
}

export enum SentimentDescription {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
  MIXED = 'mixed',
}
