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

export interface RatingIncrements {
  upvoteCountIncrement: number;
  downvoteCountIncrement: number;
}

export function ratingsToRatingCountIncrements(
  oldType: RatingType,
  newType: RatingType,
): RatingIncrements {
  if (oldType === RatingType.UPVOTE && newType === RatingType.NOVOTE) {
    return { upvoteCountIncrement: -1, downvoteCountIncrement: 0 };
  }
  if (oldType === RatingType.DOWNVOTE && newType === RatingType.NOVOTE) {
    return { upvoteCountIncrement: 0, downvoteCountIncrement: -1 };
  }
  if (oldType === RatingType.NOVOTE && newType === RatingType.UPVOTE) {
    return { upvoteCountIncrement: 1, downvoteCountIncrement: 0 };
  }
  if (oldType === RatingType.NOVOTE && newType === RatingType.DOWNVOTE) {
    return { upvoteCountIncrement: 0, downvoteCountIncrement: 1 };
  }
  if (oldType === RatingType.UPVOTE && newType === RatingType.DOWNVOTE) {
    return { upvoteCountIncrement: -1, downvoteCountIncrement: 1 };
  }
  if (oldType === RatingType.DOWNVOTE && newType === RatingType.UPVOTE) {
    return { upvoteCountIncrement: 1, downvoteCountIncrement: -1 };
  }
  return { upvoteCountIncrement: 0, downvoteCountIncrement: 0 };
}
