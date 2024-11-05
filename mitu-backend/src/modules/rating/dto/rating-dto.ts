/**
 * Data Transfer Object for Rating
 */
export enum RatingType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
  NOVOTE = 'novote',
}

/**
 * Rating DTO
 */
export default class RatingDto {
  postId: number;
  type: RatingType;
}
