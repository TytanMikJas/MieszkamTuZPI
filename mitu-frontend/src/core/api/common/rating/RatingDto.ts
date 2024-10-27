export enum RatingType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
  NOVOTE = 'novote',
}

export type RatingAttribute = 'upvoteCount' | 'downvoteCount';

export type RatingDto = {
  postId: number;
  type: RatingType;
};
