import { RatingType } from '../../../core/api/common/rating/RatingDto';
import { PerformVote } from '../../../types';
import { cn } from '@/utils/tailwind-utils';
import MinusIcon from '../../icons/minus-icon/MinusIcon';
import PlusIcon from '../../icons/plus-icon/PlusIcon';
import ExpectLoggedIn from '@/reusable-components/login-dialog/ExpectLoggedIn';
import ShortNumber from '@/reusable-components/misc/short-number/ShortNumber';

export default function Rating({
  postId,
  upvoteCount,
  downvoteCount,
  callback,
  loading,
  currentVote,
  className,
}: {
  postId: string;
  upvoteCount: number;
  downvoteCount: number;
  callback: PerformVote;
  loading: boolean;
  currentVote: RatingType;
  className?: string;
}) {
  const performUpvote = () => {
    callback(RatingType.UPVOTE, postId);
  };

  const performDownvote = () => {
    callback(RatingType.DOWNVOTE, postId);
  };

  return (
    <ExpectLoggedIn>
      <div
        className={cn(
          'flex flex-row items-center gap-1 h-9 border shadow-sm px-1 py-1.5 rounded-full ease-in duration-1',
          className,
        )}
      >
        <MinusIcon
          onClick={performDownvote}
          selected={currentVote === RatingType.DOWNVOTE}
          className="cursor-pointer hover:bg-blue-200 hover:bg-opacity-50 duration-1 ease-in rounded-full"
        />
        <div
          className="flex text-lg font-bold text-black w-9 justify-center"
          data-testid="rating-count"
        >
          <ShortNumber number={upvoteCount - downvoteCount} />
        </div>

        <PlusIcon
          onClick={performUpvote}
          selected={currentVote === RatingType.UPVOTE}
          className="cursor-pointer hover:bg-red-200 hover:bg-opacity-50 duration-1 ease-in rounded-full"
        />
      </div>
    </ExpectLoggedIn>
  );
}
