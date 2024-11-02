/**
 * Data Transfer Object for Rating
 */
export enum RatingType {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE',
  NOVOTE = 'novote',
}

/**
 * Rating DTO
 */
export default class RatingDto {
  postId: number;
  type: RatingType;
}
