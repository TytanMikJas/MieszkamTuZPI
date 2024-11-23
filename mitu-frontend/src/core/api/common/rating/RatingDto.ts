export enum RatingType {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE',
  NOVOTE = 'novote',
}

export type RatingAttribute = 'upvoteCount' | 'downvoteCount';

export type RatingDto = {
  postId: number;
  type: RatingType;
};
