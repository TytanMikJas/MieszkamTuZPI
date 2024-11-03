export enum RatingType {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE',
  NOVOTE = 'novote',
}

export default class RatingDto {
  postId: number;
  type: RatingType;
}
