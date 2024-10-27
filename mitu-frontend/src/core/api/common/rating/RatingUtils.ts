import { DOWNVOTE_COUNT, UPVOTE_COUNT } from '../../../../constants';
import { RatingAttribute, RatingType } from './RatingDto';

const parser = (type: RatingType): RatingAttribute => {
  switch (type) {
    case RatingType.UPVOTE:
      return 'upvoteCount';
    case RatingType.DOWNVOTE:
      return 'downvoteCount';
    default:
      return 'upvoteCount';
  }
};

export function RatingTypeToAttribute(
  oldType: RatingType,
  sentType: RatingType,
  recType: RatingType,
): [[RatingAttribute, number]] {
  const key = `${oldType},${sentType},${recType}`;
  const changes: any = {
    [`downvote,upvote,upvote`]: [
      ['downvoteCount', -1],
      ['upvoteCount', 1],
    ],
    [`downvote,downvote,novote`]: [['downvoteCount', -1]],
    [`novote,downvote,downvote`]: [['downvoteCount', 1]],
    [`novote,upvote,upvote`]: [['upvoteCount', 1]],
    [`upvote,upvote,novote`]: [['upvoteCount', -1]],
    [`upvote,downvote,downvote`]: [
      ['upvoteCount', -1],
      ['downvoteCount', 1],
    ],
  };

  return changes[key] || [[parser(RatingType.NOVOTE), 0]];
}
