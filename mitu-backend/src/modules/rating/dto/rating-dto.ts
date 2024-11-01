export enum RatingType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
  NOVOTE = 'novote',
}

export default class RatingDto {
  postId: number;
  type: RatingType;
}
